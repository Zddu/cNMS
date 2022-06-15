const nodemailer = require('nodemailer');
import mailConfig from '../../alarm-config';

interface MailSendParamsProps {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: { filename?: string; url?: string }[];
}
const transporter = nodemailer.createTransport({
  ...mailConfig.qq,
  secure: true,
});

export async function sendMail(params: MailSendParamsProps) {
  const options = {
    ...params,
    from: 'cool.nsm@qq.com',
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}
