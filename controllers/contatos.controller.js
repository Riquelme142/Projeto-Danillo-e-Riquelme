const db = require('../database/database');

exports.listarContatos = async (req, res) => {
  let client;
  try {
    // 1. Tenta pegar uma conexão específica do Pool
    client = await db.connect(); 
    
    // 2. Executa a query
    const result = await client.query("SELECT * FROM contatos ORDER BY nome ASC");
    
    res.json(result.rows);
  } catch (err) {
    console.error("Erro na rota listarContatos:", err);
    res.status(500).json({ erro: "Falha ao conectar ao banco. Verifique se ele não está em suspensão." });
  } finally {
    // 3. SEMPRE libera o cliente de volta para o pool, independente de sucesso ou erro
    if (client) client.release();
  }
};

// INSERIR
exports.criarContato = async (req, res) => {
  const { nome, telefone, email, observacao } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO contatos (nome, telefone, email, observacao) VALUES ($1,$2,$3,$4) RETURNING id",
      [nome, telefone, email, observacao]
    );

    res.status(201).json({
      mensagem: "Contato criado!",
      id: result.rows[0].id
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ATUALIZAR
exports.atualizarContato = async (req, res) => {
  const id = req.params.id;
  const { nome, telefone, email, observacao } = req.body;

  try {
    await db.query(
      "UPDATE contatos SET nome=$1, telefone=$2, email=$3, observacao=$4 WHERE id=$5",
      [nome, telefone, email, observacao, id]
    );

    res.json({ mensagem: "Contato atualizado!" });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// DELETAR
exports.deletarContato = async (req, res) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM contatos WHERE id=$1", [id]);

    res.json({ mensagem: "Contato excluído!" });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};