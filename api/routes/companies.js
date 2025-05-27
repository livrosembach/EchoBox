const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /company
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        idCompany,
        nameCompany,
        emailCompany,
        cnpjCompany
      FROM company
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro a buscar as empresas');
  }
});

// POST /company
router.post('/', async (req, res) => {
  try {

    const { nameCompany, emailCompany, cnpjCompany } = req.body;

    if (!nameCompany || !emailCompany || !cnpjCompany) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }

    const query = `
      INSERT INTO company (nameCompany, emailCompany, cnpjCompany)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [nameCompany, emailCompany, cnpjCompany];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar empresa');
  }
});

// PUT /company/:id
router.put('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    const { nameCompany, emailCompany, cnpjCompany } = req.body;

    const query = `
      UPDATE company 
      SET nameCompany = $1, emailCompany = $2, cnpjCompany = $3
      WHERE idCompany = $4
      RETURNING *;
    `;
    const values = [nameCompany, emailCompany, cnpjCompany, companyId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar empresa');
  }
});

// DELETE /company/:id
router.delete('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;

    const query = `DELETE FROM company WHERE idCompany = $1 RETURNING *;`;
    const result = await pool.query(query, [companyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    res.json({ message: 'Empresa deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar empresa');
  }
});

module.exports = router;