import UniversalModel from '../models';
import { sendSuccessResponse } from '../modules/sendResponse';

const Document = new UniversalModel('documents');

class DocumentController {
  static async getAllDocuments(req, res, next) {
    try {
      const { id: hrId } = req.decoded;

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
}

export default DocumentController;
