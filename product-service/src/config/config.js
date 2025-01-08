const dotenv = require("dotenv");
const path = require("path");
const { URL } = require("url");

dotenv.config({ path: path.join(process.cwd(), ".env") });

module.exports = {
  env: process.env.NODE_ENV,
  jwt_key: process.env.JWT_SECRET_KEY,
  jwt_refresh_key: process.env.JWT_REFRESH_KEY,
  jwt_refresh_token_expire: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  jwt_token_expire: process.env.JWT_TOKEN_EXPIRE,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.SOLT_ROUND,
  redis: {
    nodes: process.env.REDIS_NODES.split(",").map((url) => {
      const urlObj = new URL(url);
      return {
        host: urlObj.hostname,
        port: parseInt(urlObj.port),
      };
    }),
  },
};
