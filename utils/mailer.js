const nodemailer = require('nodemailer')
const {
  MAIL_EMAIL,
  MAIL_PASSWORD,
  UPDATE_PASSWORD_BASE_URI
} = require('../config/constants')

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASSWORD
  }
})

const generateMailBody = (to, name = '') => {
  return {
    from: MAIL_EMAIL,
    to,
    subject: 'Create your password',
    html: `<p>
        <h2>Hey, ${name}</h2>
        <br/>
        Please <a href=${UPDATE_PASSWORD_BASE_URI}>Click Here</a> to create your password
      </p>`
  }
}

module.exports = {
  mailTransporter,
  generateMailBody
}
