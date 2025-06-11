const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /status - Get all statuses
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        idStatus as idstatus,
        typeStatus as typestatus,
        colorStatus as colorstatus
      FROM status
      ORDER BY idStatus
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching statuses');
  }
});

// GET /status/:id - Get a single status by ID
router.get('/:id', async (req, res) => {
  try {
    const statusId = req.params.id;
    
    const query = `
      SELECT 
        idStatus,
        typeStatus,
        colorStatus
      FROM status
      WHERE idStatus = $1
    `;
    
    const result = await pool.query(query, [statusId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Status not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching status');
  }
});

// POST /status - Create a new status
router.post('/', async (req, res) => {
  try {
    const { typeStatus, colorStatus } = req.body;

    if (!typeStatus) {
      return res.status(400).send("Status type is required");
    }

    const query = `
      INSERT INTO status (typeStatus, colorStatus)
      VALUES ($1, $2)
      RETURNING idStatus, typeStatus, colorStatus
    `;
    
    const values = [typeStatus, colorStatus || null];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating status');
  }
});

// PUT /status/:id - Update a status
router.put('/:id', async (req, res) => {
  try {
    const statusId = req.params.id;
    const { typeStatus, colorStatus } = req.body;

    if (!typeStatus) {
      return res.status(400).send("Status type is required");
    }

    const query = `
      UPDATE status 
      SET typeStatus = $1, colorStatus = $2
      WHERE idStatus = $3
      RETURNING idStatus, typeStatus, colorStatus
    `;
    
    const values = [typeStatus, colorStatus || null, statusId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Status not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating status');
  }
});

// DELETE /status/:id - Delete a status
router.delete('/:id', async (req, res) => {
  try {
    const statusId = req.params.id;

    // First check if this status is being used by any feedback
    const checkQuery = `
      SELECT COUNT(*) FROM feedback 
      WHERE fk_feedback_idStatus = $1
    `;
    
    const checkResult = await pool.query(checkQuery, [statusId]);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete this status because it is being used by one or more feedback items' 
      });
    }

    const query = `
      DELETE FROM status 
      WHERE idStatus = $1
      RETURNING idStatus
    `;
    
    const result = await pool.query(query, [statusId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Status not found' });
    }

    res.json({ message: 'Status deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting status');
  }
});

module.exports = router;
