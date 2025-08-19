// services/correoService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/**
 * Envía un correo de notificación
 * @param {string} destinatario - Correo del usuario
 * @param {string} asunto - Asunto del correo
 * @param {string} mensaje - Cuerpo del correo
 */
async function enviarCorreo(destinatario, asunto, mensaje) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: destinatario,
    subject: asunto,
    text: mensaje
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
}

module.exports = { enviarCorreo };
