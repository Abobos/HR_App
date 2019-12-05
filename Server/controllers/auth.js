import sendSuccessResponse from '../modules/sendResponse';

class AuthController {
  static async signin(req, res, next) {
    try {
      console.log(req.body);
    } catch (e) {
      return next(e);
    }
  }
}

export default AuthController;
