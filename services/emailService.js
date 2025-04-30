// 📁 services/emailService.js

const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

// Update with your SMTP or email provider credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your@email.com',
    pass: process.env.SMTP_PASS || 'yourpassword'
  }
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"MyExchange" <no-reply@myexchange.com>',
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return false;
  }
}

// Templates (Example usage)
function buildWelcomeEmail(user) {
  return `
    <h1>Welcome to MyExchange</h1>
    <p>Hi ${user.name},</p>
    <p>Thanks for registering on our platform.</p>
  `;
}

function buildWithdrawalEmail(user, amount, token) {
  return `
    <h2>Withdrawal Alert</h2>
    <p>Hi ${user.name},</p>
    <p>You requested a withdrawal of <strong>${amount} ${token}</strong>.</p>
    <p>If this wasn't you, please contact support immediately.</p>
  `;
}

module.exports = {
  sendEmail,
  buildWelcomeEmail,
  buildWithdrawalEmail
};
