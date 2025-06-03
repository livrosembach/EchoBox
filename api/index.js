const express = require('express');
const cors = require('cors');
const pool = require('./db')
const app = express();

// Import routes
const companyRoutes = require('./routes/companies');
const feedbackRoutes = require('./routes/feedbacks');
const userRoutes = require('./routes/users');

app.use(cors());
app.use(express.json());

// Use routes
app.use('/company', companyRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/user', userRoutes);

// Route to get the categories
app.get('/category', async (req, res) => {
  try {
    const query = `
      SELECT
        idCategory,
        typeCategory
      FROM category
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro a buscar tipos de categoria')
  }
});

// Route to get the statuses
app.get('/status', async (req, res) => {
  try {
    const query = `
      SELECT
        idStatus,
        typeStatus
      FROM status
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro a buscar tipos de status')
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