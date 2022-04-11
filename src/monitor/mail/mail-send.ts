const nodemailer = require('nodemailer');

interface MailSendParamsProps {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments: { filename?: string; url?: string }[];
}
const transporter = nodemailer.createTransport({
  host: '',
  service: 'qq',
  secure: true,
  // port: ''
  auth: {
    user: '',
    pass: '',
  },
});

export async function send(params: MailSendParamsProps) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(params, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}
