import { Router } from 'express';

import DocumentController from '../controllers/document';

import { authenticateUser } from '../middlewares/tokenHandler';

const documentRouter = Router();

documentRouter.get(
  '/document',
  authenticateUser,
  DocumentController.getAllDocuments,
);

export default documentRouter;
