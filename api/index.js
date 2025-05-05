const express = require('express');
const pool = require('./db');
const app = express();

app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM "user"');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar usuários');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
