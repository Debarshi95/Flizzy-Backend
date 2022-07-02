require('dotenv').config()
const {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  MAIL_EMAIL,
  MAIL_PASSWORD,
  UPDATE_PASSWORD_BASE_URI
} = process.env

module.exports = {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  MAIL_EMAIL,
  MAIL_PASSWORD,
  UPDATE_PASSWORD_BASE_URI
}
