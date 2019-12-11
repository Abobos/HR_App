import UniversalModel from '../models';

import { sendSuccessResponse } from '../modules/sendResponse';
import { NotFoundError } from '../exceptions';

import fs from 'fs';
import path from 'path';
import { pdfManipulator } from '../utils';

const Document = new UniversalModel('documents');
const User = new UniversalModel('hrs');
const Template = new UniversalModel('templates');

class DocumentController {
  static async create(req, res, next) {
    try {
      const { name, template_id: templateId } = req.body;

      const { id: owner } = req.locals;

      if (!req.files.length)
        throw new Error('Please you must upload a document');

      const { filename: updatedfileName } = req.files[0];

      await TemplateResource.update({
        values: `file_name = '${updatedfileName}'`,
        condition: `id = ${templateId}`,
      });

      const document = await Document.create({
        columns: 'name, owner, template_id',
        values: `'${name}', ${owner}, ${templateId}`,
      });

      sendSuccessResponse(res, 201, document);
    } catch (err) {
      return next(err);
    }
  }
  static async getAllDocuments(req, res, next) {
    try {
      const { id: hrId } = req.locals;

      const queryDetails = {
        columns: '*',
        condition: `owner = ${hrId}`,
      };

      const documents = await Document.select(queryDetails);


      const queryDetailsI = {
        columns: 'first_name, last_name',
        condition: `id = ${hrId}`,
        
      };

   

      const owner = await User.select(queryDetailsI);


      const documentsMapped = documents.rows.map(async(document) => {

      const template = await Template.select({
        columns: 'recipient',
        condition: `id = ${document.template_id}`
      })

        const documentStripped = {
          id: document.id,
          name: document.name,
          full_name: `${owner.rows[0].first_name} ${owner.rows[0].last_name}`,
          recipient: template.rows[0].recipient,
          status: document.status,  
          created_at: document.created_at,
        }

        return documentStripped;
       
      })


const documentsMappedII = await Promise.all(documentsMapped);

      sendSuccessResponse(res, 200, documentsMappedII);
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

  static async delete(req, res, next) {
    try {
      const { id: documentId } = req.params;

      const document = await Document.select({
        columns: '*',
        condition: `id = ${documentId}`,
      });

      if (!document) throw new NotFoundError('This document does not exist');

      await Template.update({
        values: `file_name = ''`,
        condition: `id = ${document.rows[0].template_id}`,
      });

      await Document.delete({
        condition: `id = ${documentId}`,
      });

      sendSuccessResponse(res, 200, {
        message: 'Document deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  }

  static async signature(req, res, next) {
    try {
      const { email } = req.locals;

      const { pageNumber, width, height } = req.body;

      const { filename: imageName, mimetype } = req.files[0];

      const template = await Template.select({
        columns: '*',
        condition: `recipient = '${email}'`,
      });

      if (!template.rowCount)
        throw new NotFoundError('This template does not exist');

      const fileName = template.rows[0].file_name;

      await pdfManipulator(
        fileName,
        +pageNumber,
        'image',
        mimetype,
        +width,
        +height,
        imageName,
      );

      sendSuccessResponse(res, 201, {
        message: 'signature uploaded successfully',
      });
    } catch (e) {
      return next(err);
    }
  }
  static async signedDocuments(req, res, next) {
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

      const baseDir = path.join(__dirname, '../../signedDocs', `${fileName}`);
      const data = fs.readFileSync(baseDir);
      res.contentType('application/pdf');

      res.send(data);
    } catch (e) {
      return next(e);
    }
  }
}

export default DocumentController;
