import Model from '../models';

import { sendSuccessResponse } from '../modules/sendResponse';
import { createToken, hashPassword, comparePassword } from '../utils';
import { ConflictError, AuthenticationError } from '../exceptions';

const User = new Model('hrs');

class AuthController {
  static async signup(req, res, next) {
    try {
      const {
        first_name: firstName,
        last_name: lastName,
        email: userEmail,
        password: userPassword,
      } = req.body;

      const queryDetails = {
        columns: '*',
        condition: `email = '${userEmail}'`,
      };

      const user = await User.select(queryDetails);

      if (user.rows.length)
        throw new ConflictError('This email already exists');

      const hashedPassword = hashPassword(userPassword);

      const queryDetailsII = {
        columns: 'first_name, last_name, email, password',
        values: `'${firstName}', '${lastName}', '${userEmail}', '${hashedPassword}'`,
      };

      const newUser = await User.create(queryDetailsII);
      const { id, email, is_admin: isAdmin } = newUser;

      return sendSuccessResponse(res, 201, {
        token: createToken({
          id,
          email,
          isAdmin,
        }),
        isAdmin,
      });
    } catch (e) {
      return next(e);
    }
  }

  static async signin(req, res, next) {
    try {
      const { email: userEmail, password } = req.body;

      const queryDetails = {
        columns: '*',
        condition: `email = '${userEmail}'`,
      };

      const existingUser = await User.select(queryDetails);

      if (!existingUser.rows.length)
        throw new AuthenticationError('Invalid credentials');

      const isPasswordValid = comparePassword(
        password,
        existingUser.rows[0].password,
      );

      if (!isPasswordValid)
        throw new AuthenticationError('Invalid credentials');

      const { id, email, is_admin: isAdmin } = existingUser.rows[0];

      return sendSuccessResponse(res, 201, {
        token: createToken({
          id,
          email,
          isAdmin,
        }),
        isAdmin,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default AuthController;
