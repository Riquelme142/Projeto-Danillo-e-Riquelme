const app = require("../server"); // importa o Express app
const serverless = require("serverless-http");

module.exports = serverless(app);