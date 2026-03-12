// database.js
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está configurado. Configure a variável de ambiente no Vercel.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necessário para Neon
  },
  // Ajuda a lidar com o auto-suspend do Neon
  idleTimeoutMillis: 0, // não encerra conexões ociosas
  connectionTimeoutMillis: 8000, // tempo para esperar o banco acordar
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool:', err);
});

module.exports = pool;