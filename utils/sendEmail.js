// 📁 utils/sendEmail.js

const nodemailer = require('nodemailer');

/**
 * Send an email to a specified recipient.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} html - HTML content of the email.
 */
async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to another provider like SendGrid, Outlook, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `Crypto Exchange <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email sending failed:', err);
    throw err;
  }
}

module.exports = sendEmail;
