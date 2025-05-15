const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

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

// Route to get the categories
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

// Route to list all feedback tickets
app.get('/feedback', async (req, res) => {
  try {
    const query = `
      SELECT 
        idFeedback,
        titleFeedback,
        reviewFeedback,
        typeCategory,
        typeStatus
      FROM feedback
      JOIN category ON feedback.fk_feedback_idCategory = category.idCategory
      JOIN status ON feedback.fk_feedback_idStatus = status.idStatus
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar feedback');
  }
});

// Route to get a specific feedback ticket by ID
app.get('/feedback_detail/:id', async (req, res) => {
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

// Route to get the companies
app.get('/company', async (req, res) => {
  try {
    const query = `
      SELECT
        idCompany,
        nameCompany
      FROM company
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro a buscar as empresas')
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

// Route to send feedback
app.post('/send_feedback', async (req, res) => {
  try {
    const { titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus } = req.body;

    if (!(titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus)) {
      return res.status(400).send("Todos os campos devem ser preenchidos.");
    }

    const query = `
    INSERT INTO "feedback" (titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;

    const values = [titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch(err){
    console.error(err);
    res.status(500).send("Erro ao enviar feedback");
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