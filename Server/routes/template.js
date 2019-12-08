import upload from '../config/multer';

import { authenticateUser } from '../middlewares/tokenHandler';
import Template from '../controllers/template';
import { Router } from 'express';

const templateRouter = Router();

templateRouter.post(
  '/template',
  authenticateUser,
  upload.array('docs', 2),
  Template.create,
);

templateRouter.get('/template', authenticateUser, Template.getAllTemplates);

templateRouter.put('/template/:id', authenticateUser, Template.edit);

templateRouter.delete('/template/:id', authenticateUser, Template.delete);
export default templateRouter;
