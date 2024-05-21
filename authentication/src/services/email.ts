const mailer = require('nodemailer');
import dotenv from 'dotenv';

dotenv.config();

const transporter = mailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_VERIFICATION,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const verificationUrl = `http://musicapp.dev/api/users/verify/${verificationToken}`;

  const mailOptions = {
    from: 'Адміністратор музичного стримінгового сервісу',
    to: email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationUrl}`,
  };

  transporter.sendMail(mailOptions);
};
