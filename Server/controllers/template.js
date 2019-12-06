import UniversalModel from '../models';

import { sendSuccessResponse } from '../modules/sendResponse';

import { convertToArray } from '../utils/convertToArray';

const TemplateResource = new UniversalModel('templates');
const Document = new UniversalModel('documents');

class Template {
  static async create(req, res, next) {
    try {
      const { id: hrId } = req.decoded;
      let { name, status, recipients, action } = req.body;

      const documentFilename = req.files[0].filename;

      const groupRecipients = convertToArray(recipients).map(
        email => `'${email}'`,
      );

      let queryDetailsI = {
        columns: 'name, owner, status, recipients, file_name',
        values: `'${name}', ${hrId}, 'draft', ARRAY [${groupRecipients}], '${documentFilename}'`,
      };

      const template = await TemplateResource.create(queryDetailsI);

      if (action === 'send') {
        queryDetailsI = {
          columns: '*',
          condition: `owner = ${hrId} AND name = '${name}'`,
        };

        const { rows } = await TemplateResource.select(queryDetailsI);

        const { id: templateId, name: documentName } = rows[0];

        queryDetailsI = {
          columns: 'name, template_id',
          values: `'${documentName}', ${templateId}`,
        };
      }

      const document = await Document.create(queryDetailsI);

      sendSuccessResponse(res, 201, { ...template, document });
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
