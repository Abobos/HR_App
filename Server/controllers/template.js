import UniversalModel from '../models';

import { sendSuccessResponse } from '../modules/sendResponse';

import { convertToArray } from '../utils/convertToArray';
import { generatePassword, hashPassword } from '../utils';

import sendMail from '../services/sendMail';

const TemplateResource = new UniversalModel('templates');
const Document = new UniversalModel('documents');
const User = new UniversalModel('hrs');

class Template {
  static async createLogin(recipient) {
    const recipientPassword = generatePassword();

    const hashedPassword = hashPassword(recipientPassword);

    const queryDetailsI = {
      columns: 'email, password, is_admin',
      values: `'${recipient}', '${hashedPassword}', false `,
    };

    const createdUser = await User.create(queryDetailsI);
    createdUser.password = recipientPassword;

    return createdUser;
  }

  static async create(req, res, next) {
    try {
      const { id: hrId, email: hrEmail } = req.decoded;
      let { name, recipient, action } = req.body;

      const documentFilename = req.files[0].filename;
      let queryDetailsI = {
        columns: 'name, owner, status, recipient, file_name',
        values: `'${name}', ${hrId}, 'draft', '${recipient}', '${documentFilename}'`,
      };

      const template = await TemplateResource.create(queryDetailsI);

      let queryDetailsII;

      if (action === 'send') {
        const createdRecipient = await Template.createLogin(recipient);

        const response = await sendMail(createdRecipient, hrEmail);

        console.log(response);

        const queryDetailsIII = {
          columns: '*',
          condition: `owner = ${hrId} AND name = '${name}'`,
        };

        const { rows } = await TemplateResource.select(queryDetailsIII);

        const { id: templateId, name: documentName } = rows[0];

        queryDetailsII = {
          columns: 'name, owner, template_id',
          values: `'${documentName}', ${hrId}, ${templateId}`,
        };

        const document = await Document.create(queryDetailsII);

        return sendSuccessResponse(res, 201, { ...template, document });
      }

      sendSuccessResponse(res, 201, template);
    } catch (e) {
      next(e);
    }
  }

  static async getAllTemplates(req, res, next) {
    try {
      const { id: hrId } = req.decoded;

      let queryDetailsI = {
        columns: '*',
        condition: `owner = ${hrId}`,
      };

      const templates = await TemplateResource.select(queryDetailsI);

      sendSuccessResponse(res, 200, templates.rows);
    } catch (e) {
      return next(e);
    }
  }
}

export default Template;
