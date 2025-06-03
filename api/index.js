const express = require('express');
const cors = require('cors');
const pool = require('./db')
const app = express();

// Import routes
const companyRoutes = require('./routes/companies');
const feedbackRoutes = require('./routes/feedbacks');
// const userRoutes = require('./routes/users');

app.use(cors());
app.use(express.json());

// Use routes
app.use('/company', companyRoutes);
app.use('/feedback', feedbackRoutes);
// app.use('/user', userRoutes);

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

// Route to send feedback
app.post('/send_feedback', async (req, res) => {
  try {
    const { titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus } = req.body;

    if (!titleFeedback || !reviewFeedback || !fk_feedback_idUser || !fk_feedback_idCompany || !fk_feedback_idCategory ) {
      return res.status(400).send("Todos os campos devem ser preenchidos.");
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

// Route for login
app.post('/login', async (req, res) => {
  try{
    const {emailUser, passwordUser} = req.body;
  
    const query = `SELECT * FROM "user" WHERE emailUser = $1`;
    const value = [emailUser];
    const result = await pool.query(query, value);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    if (passwordUser === user.passworduser) {
      res.json({ success: true, message: 'Login bem-sucedido', clientid: user.clientID });
    } else {
      res.status(401).json({ success: false, message: 'Senha incorreta' });
    }
  } catch(err){
    console.error(err);
    res.status(500).send("Erro ao fazer login do usuário");
  }
})


// App listen shit dont touch
app.listen(3003, () => {
  console.log('Servidor rodando em http://localhost:3003');
});