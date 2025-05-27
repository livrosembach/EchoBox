const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /feedback
router.get('/', async (req, res) => {
  try {
    const { search, category, status } = req.query;

    let query = `
      SELECT 
        f.idFeedback,
        f.titleFeedback,
        f.reviewFeedback,
        cat.typeCategory,
        s.typeStatus
      FROM feedback f
      JOIN category cat ON f.fk_feedback_idCategory = cat.idCategory
      JOIN status s ON f.fk_feedback_idStatus = s.idStatus
    `;
    
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(f.titleFeedback ILIKE $${paramIndex} OR f.reviewFeedback ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (category && category !== 'all-categories') {
      conditions.push(`f.fk_feedback_idCategory = $${paramIndex}`);
      values.push(parseInt(category));
      paramIndex++;
    }

    if (status && status !== 'all-status') {
      conditions.push(`f.fk_feedback_idStatus = $${paramIndex}`);
      values.push(parseInt(status));
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar feedback');
  }
});

// GET /feedback/:id
router.get('/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    
    const query = `
      SELECT 
        idFeedback,
        titleFeedback,
        reviewFeedback,
        emailUser,
        nameCompany,
        typeCategory,
        typeStatus
      FROM feedback
      JOIN "user" ON feedback.fk_feedback_idUser = "user".idUser
      JOIN company ON feedback.fk_feedback_idCompany = company.idCompany
      JOIN category ON feedback.fk_feedback_idCategory = category.idCategory
      JOIN status ON feedback.fk_feedback_idStatus = status.idStatus
      WHERE idFeedback = $1
    `;
    
    const result = await pool.query(query, [feedbackId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar feedback');
  }
});

// POST /feedback
router.post('/', async (req, res) => {
  try {
    const { titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus } = req.body;

    if (!titleFeedback || !reviewFeedback || !fk_feedback_idUser || !fk_feedback_idCompany || !fk_feedback_idCategory ) {
      return res.status(400).send("Todos os campos obrigatórios devem ser preenchidos.");
    }

    const query = `
    INSERT INTO "feedback" (titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;

    const values = [titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus || 1];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch(err){
    console.error(err);
    res.status(500).send("Erro ao enviar feedback");
  }
});

// PUT /feedback/:id
router.put('/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { titleFeedback, reviewFeedback, fk_feedback_idCategory, fk_feedback_idStatus } = req.body;

    const query = `
      UPDATE feedback 
      SET titleFeedback = $1, reviewFeedback = $2, fk_feedback_idCategory = $3, fk_feedback_idStatus = $4
      WHERE idFeedback = $5
      RETURNING *;
    `;
    const values = [titleFeedback, reviewFeedback, fk_feedback_idCategory, fk_feedback_idStatus, feedbackId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Feedback não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar feedback');
  }
});

// DELETE /feedback/:id
router.delete('/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;

    const query = `DELETE FROM feedback WHERE idFeedback = $1 RETURNING *;`;
    const result = await pool.query(query, [feedbackId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Feedback não encontrado' });
    }

    res.json({ message: 'Feedback deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar feedback');
  }
});

module.exports = router;