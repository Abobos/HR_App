import UniversalModel from '../models';

import { sendSuccessResponse } from '../modules/sendResponse';

import { generatePassword, hashPassword, createToken } from '../utils';

import sendMail from '../services/sendMail';
import { NotFoundError } from '../exceptions';

const TemplateResource = new UniversalModel('templates');
const Document = new UniversalModel('documents');
const User = new UniversalModel('hrs');

class Template {
  static async createLogin(recipient) {
    const recipientPassword = generatePassword();

    console.log("I'm here")

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
      const { id: hrId, email: hrEmail } = req.locals;
      let { name, recipient, action } = req.body;

      let documentFilename;

      if (req.files.length) documentFilename = req.files[0].filename;

      let queryDetailsI = {
        columns: 'name, owner, status, recipient, file_name',
        values: `'${name}', ${hrId}, 'draft', '${recipient}', '${documentFilename}'`,
      };

      const template = await TemplateResource.create(queryDetailsI);

      let queryDetailsII;

      if (action === 'send') {
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

console.log("propose")
        const document = await Document.create(queryDetailsII);

        const createdRecipient = await Template.createLogin(recipient);

        const link = 'https://hr-app3.netlify.com/signature';

        const response = await sendMail(createdRecipient, hrEmail, link);

        if (response === 'success') {
          await TemplateResource.update({
            values: `status = 'active'`,
            condition: `id = ${templateId}`,
          });
        }

        return sendSuccessResponse(res, 201, {
          ...template,
          document,
          mailStatus: response,
        });
      }

      sendSuccessResponse(res, 201, template);
    } catch (e) {
      next(e);
    }
  }

  static async getAllTemplates(req, res, next) {
    try {
      const { id: hrId } = req.locals;

      let queryDetailsI = {
        columns: '*',
        condition: `owner = ${hrId}`,
      };

      const templates = await TemplateResource.select(queryDetailsI);

      const queryDetails = {
        columns: 'first_name, last_name',
        condition: `id = ${hrId}`,
      };

      const owner = await User.select(queryDetails);

      const templatesMapped = templates.rows.map((template) => {

        const templateStripped = {
          id: template.id,
          name: template.name,
          full_name: `${owner.rows[0].first_name} ${owner.rows[0].last_name}`,
          recipient: template.recipient,
          status: template.status,
          created_at: template.created_at,
        }

        return templateStripped;
       
      })

      sendSuccessResponse(res, 200, templatesMapped);
    } catch (e) {
      return next(e);
    }
  }

  static async edit(req, res, next) {
    try {
      const { id: templateId } = req.params;

      const { name } = template;

      const fileName = req.files[0].filename;

      const template = await TemplateResource.select({
        columns: '*',
        condition: `id = ${templateId}`,
      });

      const updatedName = name || template.rows[0].name;
      const updatedfileName = fileName || template.rows[0].file_name;

      const updatedTemplate = await TemplateResource.update({
        values: `name = '${updatedName}' AND file_name = '${updatedfileName}'`,
        condition: `id = ${templateId}`,
      });

      sendSuccessResponse(res, 200, updatedTemplate);
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id: templateId } = req.params;

      const template = await TemplateResource.select({
        columns: '*',
        condition: `id = ${templateId}`,
      });

      if (!template) throw new NotFoundError('This template does not exist');

      await TemplateResource.delete({
        condition: `id = ${templateId}`,
      });

      await Document.delete({
        condition: `template_id = ${templateId}`,
      });

      sendSuccessResponse(res, 200, {
        message: 'Template deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default Template;
