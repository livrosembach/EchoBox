const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /category - Get all categories
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        idCategory as idcategory,
        typeCategory as typecategory,
        colorCategory as colorcategory
      FROM category
      ORDER BY idCategory
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching categories');
  }
});

// GET /category/:id - Get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const query = `
      SELECT 
        idCategory,
        typeCategory,
        colorCategory
      FROM category
      WHERE idCategory = $1
    `;
    
    const result = await pool.query(query, [categoryId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching category');
  }
});

// POST /category - Create a new category
router.post('/', async (req, res) => {
  try {
    const { typeCategory, colorCategory } = req.body;

    if (!typeCategory) {
      return res.status(400).send("Category type is required");
    }

    const query = `
      INSERT INTO category (typeCategory, colorCategory)
      VALUES ($1, $2)
      RETURNING idCategory, typeCategory, colorCategory
    `;
    
    const values = [typeCategory, colorCategory || null];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating category');
  }
});

// PUT /category/:id - Update a category
router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { typeCategory, colorCategory } = req.body;

    if (!typeCategory) {
      return res.status(400).send("Category type is required");
    }

    const query = `
      UPDATE category 
      SET typeCategory = $1, colorCategory = $2
      WHERE idCategory = $3
      RETURNING idCategory, typeCategory, colorCategory
    `;
    
    const values = [typeCategory, colorCategory || null, categoryId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating category');
  }
});

// DELETE /category/:id - Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    // First check if this category is being used by any feedback
    const checkQuery = `
      SELECT COUNT(*) FROM feedback 
      WHERE fk_feedback_idCategory = $1
    `;
    
    const checkResult = await pool.query(checkQuery, [categoryId]);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete this category because it is being used by one or more feedback items' 
      });
    }

    const query = `
      DELETE FROM category 
      WHERE idCategory = $1
      RETURNING idCategory
    `;
    
    const result = await pool.query(query, [categoryId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting category');
  }
});

module.exports = router;
