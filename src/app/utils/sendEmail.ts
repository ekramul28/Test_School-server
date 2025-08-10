/* eslint-disable no-undef */
import nodemailer from 'nodemailer';
import config from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async (
  to: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  html: any,
  subject: string,
  attachmentBuffer: Buffer,
  filename: string,
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'mdekramulhassan168@gmail.com',
      pass: 'tffp gopv flal wlaj',
    },
  });

  await transporter.sendMail({
    from: 'mdekramulhassan168@gmail.com', // sender address
    to: to, // list of receivers
    subject, // Subject line
    text: '', // plain text body
    html, // html body
    attachments: [
      {
        filename,
        content: attachmentBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
};
