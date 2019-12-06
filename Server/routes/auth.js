import { Router } from 'express';
import { validator } from '../middlewares/auth';
import AuthController from '../controllers/auth';

const authRouter = Router();

authRouter.post('/register', validator, AuthController.signup);
authRouter.post('/login', validator, AuthController.signin);

export default authRouter;
