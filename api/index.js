const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

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

app.post('/feedback', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM feedback');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar feedback');
  }
});

app.listen(3003, () => {
  console.log('Servidor rodando em http://localhost:3003');
});

