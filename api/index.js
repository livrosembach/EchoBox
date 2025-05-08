const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Route to get the feedvack snippets
app.get('/feedback', async (req, res) => {
  try {
    const query = `
      SELECT 
        feedback.idFeedback,
        feedback.titleFeedback,
        feedback.reviewFeedback,
        feedback.ratingFeedback,
        category.typeCategory AS categoryName,
        status.typeStatus AS statusName
      FROM feedback
      JOIN category ON feedback.fk_feedback_idCategory = category.idCategory
      JOIN status ON feedback.fk_feedback_idStatus = status.idStatus
    `;
    const resultado = await pool.query(query);
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar feedback');
  }
});

// Route to register a user
app.post('/register', async (req, res) => {
  try {
    const { emailUser, passwordUser, fk_user_idCompany } = req.body;

    if (!emailUser || !passwordUser) {
      return res.status(400).send('Email and password are required');
    }

    const query = `
      INSERT INTO "user" (emailUser, passwordUser, fk_user_idCompany)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [emailUser, passwordUser, fk_user_idCompany || null];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao registrar usuário');
  }
});


// App listen shit dont touch
app.listen(3003, () => {
  console.log('Servidor rodando em http://localhost:3003');
});