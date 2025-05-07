const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/feedback', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM feedback');
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

