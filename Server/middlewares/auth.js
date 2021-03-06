import {
  emailRegex,
  passwordRegex,
  nameRegex,
  validateAgainstRegex,
  errorChecker,
  magicTrimmer,
} from '../modules/validator';

import { sendErrorResponse } from '../modules/sendResponse';

export const validator = (req, res, next) => {
  const userData = magicTrimmer(req.body);

  const {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  } = userData;

  let schema;

  const signUpschema = {
    first_name: validateAgainstRegex(firstName, nameRegex, 'first name'),
    last_name: validateAgainstRegex(lastName, nameRegex, 'last name'),
    email: validateAgainstRegex(email, emailRegex, 'email'),
    password: validateAgainstRegex(password, passwordRegex, 'password'),
  };

  const signinSchema = {
    email: validateAgainstRegex(email, emailRegex, 'email'),
    password: validateAgainstRegex(password, passwordRegex, 'password'),
  };

  req.route.path === '/register'
    ? (schema = signUpschema)
    : (schema = signinSchema);

  const errors = errorChecker(schema);

  if (errors) return sendErrorResponse(res, 422, errors);

  next();
};

export default validator;
