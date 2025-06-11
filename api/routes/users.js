const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// I know this is bad I also dont care
const JWT_SECRET = 'your-secret-key-here';

// Route to register a user
router.post('/', async (req, res) => {
  try {
    const { emailUser, passwordUser, fk_user_idCompany } = req.body;

    if (!emailUser || !passwordUser) {
      return res.status(400).send('Email and password are required');
    }

    // Generate profile picture URL
    const pictureUser = `https://placehold.co/250?text=${encodeURIComponent(emailUser)}`;

    const query = `
      INSERT INTO "user" (emailUser, passwordUser, pictureUser, fk_user_idCompany)
      VALUES ($1, encode(digest($2, 'sha256'), 'hex'), $3, $4)
      RETURNING idUser, emailUser, pictureUser, fk_user_idCompany;
    `;
    const values = [emailUser, passwordUser, pictureUser, fk_user_idCompany || null];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao registrar usuário');
  }
});

// Route for login
router.post('/login', async (req, res) => {
  try{
    const {emailUser, passwordUser} = req.body;
  
    const query = `
      SELECT idUser, emailUser, fk_user_idCompany, pictureUser, passwordUser
      FROM "user" 
      WHERE emailUser = $1 AND passwordUser = encode(digest($2, 'sha256'), 'hex')
    `;
    const values = [emailUser, passwordUser];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado ou senha incorreta' });
    }

    const user = result.rows[0];
    const token = jwt.sign(
      { 
        userId: user.iduser, 
        email: user.emailuser,
        companyId: user.fk_user_idcompany 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      token: token,
      user: {
        id: user.iduser,
        email: user.emailuser,
        companyId: user.fk_user_idcompany,
        pictureUser: user.pictureuser
      }
    });
  } catch(err){
    console.error(err);
    res.status(500).json({ message: "Erro ao fazer login do usuário" });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        u.idUser,
        u.emailUser,
        u.pictureUser,
        u.fk_user_idCompany,
        c.nameCompany
      FROM "user" u
      LEFT JOIN company c ON u.fk_user_idCompany = c.idCompany
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar usuários');
  }
});

// Get specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const query = `
      SELECT 
        u.idUser,
        u.emailUser,
        u.pictureUser,
        c.nameCompany,
        c.idCompany
      FROM "user" u
      LEFT JOIN company c ON u.fk_user_idCompany = c.idCompany
      WHERE u.idUser = $1
    `;
    
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar usuário');
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { emailUser, passwordUser, fk_user_idCompany } = req.body;

    if (!emailUser) {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    let query, values;
    
    if (passwordUser) {
      query = `
        UPDATE "user" 
        SET emailUser = $1, passwordUser = $2, fk_user_idCompany = $3
        WHERE idUser = $4
        RETURNING *;
      `;
      values = [emailUser, passwordUser, fk_user_idCompany || null, userId];
    } else {
      query = `
        UPDATE "user" 
        SET emailUser = $1, fk_user_idCompany = $2
        WHERE idUser = $3
        RETURNING *;
      `;
      values = [emailUser, fk_user_idCompany || null, userId];
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar usuário');
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autorização necessário' });
    }

    // Extract and verify JWT token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    let currentUser;
    try {
      currentUser = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Prevent user from deleting themselves
    if (parseInt(currentUser.userId) === parseInt(userId)) {
      return res.status(403).json({ message: 'Você não pode deletar sua própria conta' });
    }

    const query = `DELETE FROM "user" WHERE idUser = $1 RETURNING *;`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar usuário');
  }
});

module.exports = router;