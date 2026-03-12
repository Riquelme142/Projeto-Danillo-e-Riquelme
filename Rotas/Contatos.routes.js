// Rotas/Contatos.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../database/database');

// LISTAR CONTATOS
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contatos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro GET /contatos:', err);
    res.status(500).json({ error: 'Erro interno ao listar contatos' });
  }
});

// CADASTRAR CONTATO
router.post('/', async (req, res) => {
  try {
    const { nome, telefone, email, observacao } = req.body;
    if (!nome || !telefone) return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });

    const result = await pool.query(
      'INSERT INTO contatos (nome, telefone, email, observacao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, telefone, email, observacao]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro POST /contatos:', err);
    res.status(500).json({ error: 'Erro interno ao cadastrar contato' });
  }
});

// ATUALIZAR CONTATO
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, telefone, email, observacao } = req.body;
    if (!nome || !telefone) return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });

    const result = await pool.query(
      'UPDATE contatos SET nome=$1, telefone=$2, email=$3, observacao=$4 WHERE id=$5 RETURNING *',
      [nome, telefone, email, observacao, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Contato não encontrado' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Erro PUT /contatos/${req.params.id}:`, err);
    res.status(500).json({ error: 'Erro interno ao atualizar contato' });
  }
});

// DELETAR CONTATO
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query('DELETE FROM contatos WHERE id=$1 RETURNING *', [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Contato não encontrado' });

    res.status(204).send();
  } catch (err) {
    console.error(`Erro DELETE /contatos/${req.params.id}:`, err);
    res.status(500).json({ error: 'Erro interno ao deletar contato' });
  }
});

module.exports = router;