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
    from: 'Адміністратор музичного стримінгового сервісу "Меломан"',
    to: email,
    subject: 'Email Verification - Приєднуйся до "Меломана"!',
    html: `
      <!DOCTYPE html>
      <html lang="uk">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Підтвердження електронної пошти - Меломан</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }

          .container {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .header {
            text-align: center;
            margin-bottom: 20px;
          }

          .heading {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .message {
            line-height: 1.5;
            margin-bottom: 20px;
          }

          .verification-link {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
            text-decoration: none;
          }

          .footer {
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 class="heading">Підтвердження електронної пошти - Меломан</h2>
          </div>

          <p class="message">
            Вітаємо! Дякуємо, що зареєструвалися на Меломан, ваш улюблений музичний стримінговий сервіс.
          </p>

          <p class="message">
            Щоб розпочати подорож зі світу музики, будь ласка, підтвердіть свою електронну адресу, натиснувши на посилання нижче:
          </p>

          <a href="${verificationUrl}" class="verification-link">Підтвердити email</a>

          <p class="message">
            Цей посилання дійсне протягом 1 години.
          </p>

          <div class="footer">
            <p>&copy; 2024 Меломан. Всі права захищені.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions);
};
