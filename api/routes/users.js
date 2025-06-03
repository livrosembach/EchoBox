const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// I know this is bad I also dont care
const JWT_SECRET = 'your-secret-key-here';

// Route to register a user
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
  try{
    const {emailUser, passwordUser} = req.body;
  
    const query = `SELECT * FROM "user" WHERE emailUser = $1`;
    const value = [emailUser];
    const result = await pool.query(query, value);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    if (passwordUser === user.passworduser) {
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
          companyId: user.fk_user_idcompany
        }
      });
    } else {
      res.status(401).json({ message: 'Senha incorreta' });
    }
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