const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// I know this is bad I also dont care
const JWT_SECRET = 'your-secret-key-here';

// GET /feedback
router.get('/', async (req, res) => {
  try {
    const { search, category, status, company } = req.query;

    let query = `
      SELECT 
        f.idFeedback,
        f.titleFeedback,
        f.reviewFeedback,
        cat.typeCategory,
        cat.colorCategory,
        s.typeStatus,
        s.colorStatus
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

    if (company && company !== 'all-companies') {
      conditions.push(`f.fk_feedback_idCompany = $${paramIndex}`);
      values.push(parseInt(company));
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

// GET /feedback/:id
router.get('/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    
    const query = `
      SELECT 
        feedback.idFeedback,
        feedback.titleFeedback,
        feedback.reviewFeedback,
        feedback.fk_feedback_idUser,
        feedback.fk_feedback_idCompany,
        feedback.fk_feedback_idCategory,
        feedback.fk_feedback_idStatus,
        "user".emailUser,
        "user".pictureUser,
        company.nameCompany,
        category.typeCategory,
        category.colorCategory,
        status.typeStatus,
        status.colorStatus
      FROM feedback
      JOIN "user" ON feedback.fk_feedback_idUser = "user".idUser
      JOIN company ON feedback.fk_feedback_idCompany = company.idCompany
      JOIN category ON feedback.fk_feedback_idCategory = category.idCategory
      JOIN status ON feedback.fk_feedback_idStatus = status.idStatus
      WHERE feedback.idFeedback = $1
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

// PUT /feedback/:id/status - Update feedback status with authorization
router.put('/:id/status', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { fk_feedback_idStatus } = req.body;
    const authHeader = req.headers.authorization;

    console.log("Status update request:", {
      feedbackId,
      requestBody: req.body,
      statusId: fk_feedback_idStatus
    });

    // Validate status ID
    if (!fk_feedback_idStatus) {
      return res.status(400).json({ message: 'Status ID é obrigatório' });
    }

    // Check if authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autorização necessário' });
    }

    // Extract and verify JWT token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    let currentUser;
    try {
      currentUser = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", currentUser);
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Get feedback details to check authorization
    const feedbackQuery = `
      SELECT 
        feedback.fk_feedback_idUser,
        feedback.fk_feedback_idCompany,
        feedback.fk_feedback_idStatus,
        "user".fk_user_idCompany as userCompanyId
      FROM feedback
      JOIN "user" ON feedback.fk_feedback_idUser = "user".idUser
      WHERE feedback.idFeedback = $1
    `;
    
    const feedbackResult = await pool.query(feedbackQuery, [feedbackId]);
    
    if (feedbackResult.rows.length === 0) {
      return res.status(404).json({ message: 'Feedback não encontrado' });
    }

    const feedback = feedbackResult.rows[0];
    console.log("Feedback data from DB:", feedback);
    
    // Check authorization:
    // 1. User who created the feedback
    // 2. User who works at the company the feedback is about
    // 3. EchoBox admin (company ID = 1)
    const canUpdateStatus = 
      parseInt(currentUser.userId) === parseInt(feedback.fk_feedback_iduser) ||
      parseInt(currentUser.companyId) === parseInt(feedback.fk_feedback_idcompany) ||
      parseInt(currentUser.companyId) === 1; // EchoBox admin

    console.log("Auth check:", {
      currentUserId: parseInt(currentUser.userId),
      feedbackUserId: parseInt(feedback.fk_feedback_iduser),
      currentCompanyId: parseInt(currentUser.companyId),
      feedbackCompanyId: parseInt(feedback.fk_feedback_idcompany),
      canUpdateStatus
    });

    if (!canUpdateStatus) {
      return res.status(403).json({ message: 'Você não tem permissão para alterar o status deste feedback' });
    }

    // Update the feedback status
    const updateQuery = `
      UPDATE feedback 
      SET fk_feedback_idStatus = $1
      WHERE idFeedback = $2
      RETURNING 
        feedback.idFeedback,
        feedback.titleFeedback,
        feedback.reviewFeedback,
        feedback.fk_feedback_idUser,
        feedback.fk_feedback_idCompany,
        feedback.fk_feedback_idCategory,
        feedback.fk_feedback_idStatus
    `;
    
    const updateResult = await pool.query(updateQuery, [fk_feedback_idStatus, feedbackId]);

    // Get the updated feedback with all related data
    const fullFeedbackQuery = `
      SELECT 
        feedback.idFeedback,
        feedback.titleFeedback,
        feedback.reviewFeedback,
        feedback.fk_feedback_idUser,
        feedback.fk_feedback_idCompany,
        feedback.fk_feedback_idCategory,
        feedback.fk_feedback_idStatus,
        "user".emailUser,
        "user".pictureUser,
        company.nameCompany,
        category.typeCategory,
        category.colorCategory,
        status.typeStatus,
        status.colorStatus
      FROM feedback
      JOIN "user" ON feedback.fk_feedback_idUser = "user".idUser
      JOIN company ON feedback.fk_feedback_idCompany = company.idCompany
      JOIN category ON feedback.fk_feedback_idCategory = category.idCategory
      JOIN status ON feedback.fk_feedback_idStatus = status.idStatus
      WHERE feedback.idFeedback = $1
    `;
    
    const fullResult = await pool.query(fullFeedbackQuery, [feedbackId]);

    res.json(fullResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar status do feedback');
  }
});

module.exports = router;