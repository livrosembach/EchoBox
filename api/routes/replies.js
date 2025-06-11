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
        reply.createdDate,
        "user".emailUser,
        company.nameCompany
      FROM reply
      JOIN "user" ON reply.fk_reply_idUser = "user".idUser
      LEFT JOIN company ON "user".fk_user_idCompany = company.idCompany
      WHERE reply.fk_reply_idFeedback = $1
      ORDER BY reply.createdDate ASC
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

    // Check if the user has permission to reply to this feedback
    const feedbackQuery = `
      SELECT 
        feedback.fk_feedback_idUser,
        feedback.fk_feedback_idCompany,
        "user".fk_user_idCompany
      FROM feedback
      JOIN "user" ON "user".idUser = $2
      WHERE feedback.idFeedback = $1
    `;
    
    const feedbackResult = await pool.query(feedbackQuery, [fk_reply_idFeedback, fk_reply_idUser]);
    
    if (feedbackResult.rows.length === 0) {
      return res.status(404).send('Feedback não encontrado ou usuário inválido');
    }
    
    const feedbackData = feedbackResult.rows[0];
    
    // Check permissions: user can reply to their own feedback or company users can reply to their company's feedback
    const canReply = 
      feedbackData.fk_feedback_iduser == fk_reply_idUser || // User replying to their own feedback
      (feedbackData.fk_user_idcompany && feedbackData.fk_user_idcompany == feedbackData.fk_feedback_idcompany); // Company user replying to their company's feedback
    
    if (!canReply) {
      return res.status(403).send('Você não tem permissão para responder a este feedback');
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
