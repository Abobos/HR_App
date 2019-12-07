import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default class MailHandler {
  static async sendEmail(email, password, hrEmail, token, link) {
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
      subject: 'Document Signature Request',
      html: `<p>Hello there,</p>
      <p>Trust this meets you well.</p>

    <div style="background-color: orange; color: white; padding: 1px 1px"><p>Document Signature Request</p></div>
    <p>Click on this <a href='${link}?token=${token}'>LINK</a> and use the login details below to access the document</p>
    <p><b>email</b>: <span style="text-decoration: none">${email}</span><br>
    <b>password</b>: ${password}
    </p>

    <h5 style="color: orange">Disclaimer:</h5>
    <em>Note that this is an auto generated email. If you have any questions about the document, 
    please contact ${hrEmail}
    </em>`,
    };

    try {
      const response = await transporter.sendMail(mailOptions);
      if (response.accepted) {
        return 'success';
      }
    } catch (error) {
      console.error(error);
      return 'fail';
    }
  }
}
