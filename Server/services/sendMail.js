import 'dotenv/config';
import pushEmail from '../utils/email';
import { createToken } from '../utils';

const sendMail = async user => {
  const r = await pushEmail.sendEmail(
    user.email,
    user.password,
    createToken({ email: user.email }),
  );
  return r;
};

export default sendMail;
