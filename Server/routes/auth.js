import { Router } from 'express';
import AuthController from '../controllers/auth';

const authRouter = Router();

authRouter.post('/signin', AuthController.signin);

export default authRouter;
