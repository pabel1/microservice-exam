const config = require("../config/config");

const allowedOrigins = [config.origin, "http://localhost:5173"];

module.exports = allowedOrigins;
