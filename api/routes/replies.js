const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /replies/feedback/:feedbackId - Get all replies for a specific feedback
router.get('/feedback/:feedbackId', async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    
    const query = `
      SELECT 
        reply.idReply,
        reply.titleReply,
        reply.reviewReply,
        reply.fk_reply_idFeedback,
        reply.fk_reply_idUser,
        "user".emailUser,
        company.nameCompany
      FROM reply
      JOIN "user" ON reply.fk_reply_idUser = "user".idUser
      LEFT JOIN company ON "user".fk_user_idCompany = company.idCompany
      WHERE reply.fk_reply_idFeedback = $1
      ORDER BY reply.idReply ASC
    `;
    
    const result = await pool.query(query, [feedbackId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar respostas');
  }
});

// POST /replies - Create a new reply
router.post('/', async (req, res) => {
  try {
    const { titleReply, reviewReply, fk_reply_idFeedback, fk_reply_idUser } = req.body;

    if (!titleReply || !reviewReply || !fk_reply_idFeedback || !fk_reply_idUser) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }

    const query = `
      INSERT INTO reply (titleReply, reviewReply, fk_reply_idFeedback, fk_reply_idUser)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [titleReply, reviewReply, fk_reply_idFeedback, fk_reply_idUser];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar resposta');
  }
});

module.exports = router;
