import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default class MailHandler {
  static async sendEmail(email, firstname, password) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'noreply@propertyprolite.com',
      to: email,
      subject: 'Here is your new password',
      html: `<p>Dear ${firstname},</p>
    <p>Find your new password below</p>
    <p><b>New Password</b>: ${password}</p>
    <p><em>Note that you can simply change this password to the one most preferred by you</em></p>`,
    };

    try {
      const response = await transporter.sendMail(mailOptions);
      if (response.accepted) {
        return 'success';
      }
    } catch (error) {
      return 'fail';
    }
  }
}
