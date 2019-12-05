import sgMail from '@sendgrid/mail';
import 'dotenv/config';

import { InternalServerError } from '../exceptions';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (receiver, subject, content) => {
  const data = {
    to: receiver,
    from: 'noreply@propertyprolite.com',
    subject,
    html: content,
  };
  try {
    const response = await sgMail.send(data);
    if (response.length) return 'success';
  } catch (err) {
    throw new InternalServerError(err);
  }
};

export default sendEmail;
