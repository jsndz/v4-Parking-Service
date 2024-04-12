const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  pw: process.env.password,
};
