import UniversalModel from '../models';
import { sendSuccessResponse } from '../modules/sendResponse';
import { NotFoundError } from '../exceptions';
import fs from 'fs';
import path from 'path';

const Document = new UniversalModel('documents');
const Template = new UniversalModel('templates');

class DocumentController {
  static async getAllDocuments(req, res, next) {
    try {
      const { id: hrId } = req.locals;

      const queryDetails = {
        columns: '*',
        condition: `owner = ${hrId}`,
      };

      const documents = await Document.select(queryDetails);

      sendSuccessResponse(res, 200, documents.rows);
    } catch (e) {
      return next(e);
    }
  }

  static async getSpecificDocument(req, res, next) {
    try {
      const { id: documentId } = req.params;

      const document = await Document.select({
        columns: 'template_id',
        condition: `id = ${documentId}`,
      });

      if (!document.rowCount) throw new NotFoundError('Document not found');

      const templateId = document.rows[0].template_id;

      const template = await Template.select({
        columns: 'file_name',
        condition: `id =${templateId}`,
      });

      if (!template.rowCount) throw new NotFoundError('Template not found');

      const fileName = template.rows[0].file_name;

      const baseDir = path.join(__dirname, '../../uploads', `${fileName}`);
      const data = fs.readFileSync(baseDir);
      res.contentType('application/pdf');

      res.send(data);
    } catch (error) {
      next(error);
    }
  }
}

export default DocumentController;
