import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default class MailHandler {
  static async sendEmail(email, password, token) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'notifications@GTBankHRApp.com',
      to: email,
      subject: 'Signature Request',
      html: `<p>Hello there</p>
      <p>Trust this meets you well</p>

    <div style="background-color: orange; color: white"><p>Document Signature Request</p></div>
    <p>Click on this <a href="localhost:8080/api/v1/document?token=${token}>link</a>and use the login details below to access your document</p>
    <p><b>email</b>: ${email}
    <b>password</b>: ${password}
    </p>

    <h4 style="color: orange">Disclaimer</h4>
    <p><em>Note that this is an auto generated email. If you have any questions about the document, 
    kindly email to the sender directly</em></p>`,
    };

    try {
      const response = await transporter.sendMail(mailOptions);
      if (response.accepted) {
        return 'success';
      }
    } catch (error) {
      console.log(error);
      return 'fail';
    }
  }
}
