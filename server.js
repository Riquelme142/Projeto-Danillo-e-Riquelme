// server.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// Frontend (pasta correta)
app.use(express.static(path.join(__dirname, "public")));

// Rotas da API
const contatosRoutes = require("./Rotas/Contatos.routes");
app.use("/api/contatos", contatosRoutes);

// Middleware de erro genérico (garante JSON em respostas de erro)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Erro interno do servidor" });
});

// Export para Vercel
module.exports = app;