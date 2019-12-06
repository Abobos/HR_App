import UniversalModel from '../models';

import { sendSuccessResponse } from '../modules/sendResponse';

import { convertToArray } from '../utils/convertToArray';
import { generatePassword, hashPassword } from '../utils';

const TemplateResource = new UniversalModel('templates');
const Document = new UniversalModel('documents');
const User = new UniversalModel('hrs');

class Template {
  static async createLogin(recipients) {
    const users = [];

    const passwords = [];

    for (let recipient of recipients) {
      const recipientsPassword = generatePassword();

      passwords.push(recipientsPassword);

      const hashedPassword = hashPassword(recipientsPassword);

      const queryDetailsI = {
        columns: 'email, password, is_admin',
        values: `${recipient}, '${hashedPassword}', false `,
      };

      users.push(User.create(queryDetailsI));
    }

    let createdUsers = await Promise.all(users);

    createdUsers = createdUsers.map((createdUser, i) => {
      createdUser.password = passwords[i];
      return createdUser;
    });

    return createdUsers;
  }

  static async create(req, res, next) {
    try {
      const { id: hrId } = req.decoded;
      let { name, recipients, action } = req.body;

      const documentFilename = req.files[0].filename;

      const groupRecipients = convertToArray(recipients).map(
        email => `'${email}'`,
      );

      let queryDetailsI = {
        columns: 'name, owner, status, recipients, file_name',
        values: `'${name}', ${hrId}, 'draft', ARRAY [${groupRecipients}], '${documentFilename}'`,
      };

      const template = await TemplateResource.create(queryDetailsI);

      let queryDetailsII;

      if (action === 'send') {
        const createdRecipients = await Template.createLogin(groupRecipients);

        createdRecipients.forEach(createdRecipient => {
          createdRecipients.password;
        });
        console.log(createdRecipients);

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
