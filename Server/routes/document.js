import { Router } from 'express';

import DocumentController from '../controllers/document';

import { authenticateUser } from '../middlewares/tokenHandler';
import upload from '../config/multer';

const documentRouter = Router();

documentRouter.get(
  '/document',
  authenticateUser,
  DocumentController.getAllDocuments,
);
documentRouter.get(
  '/document/:id',
  authenticateUser,
  DocumentController.getSpecificDocument,
);

documentRouter.get(
  '/document/signed/:id',
  authenticateUser,
  DocumentController.signedDocuments,
);

documentRouter.delete(
  '/document/:id',
  authenticateUser,
  DocumentController.delete,
);

documentRouter.post(
  '/document/signature',
  authenticateUser,
  upload.array('signature', 2),
  DocumentController.signature,
);

export default documentRouter;
