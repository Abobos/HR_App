import 'dotenv/config';
import pushEmail from '../utils/email';
import { createToken } from '../utils';

const sendMail = async (user, hrEmail, link) => {
  const response = await pushEmail.sendEmail(
    user.email,
    user.password,
    hrEmail,
    createToken({ email: user.email }),
    link,
  );
  return response;
};

export default sendMail;
