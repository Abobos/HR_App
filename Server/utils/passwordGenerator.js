import dotenv from 'dotenv';

dotenv.config();

const { UNIQUE_DIGIT: uniqueDigit } = process.env;

const generatePassword = () => {
  const sanitizedString = 'GTBApp';

  const length = 5;

  let randomString = '';

  for (let i = 0; i < length; i += 1) {
    randomString += uniqueDigit.charAt(
      Math.floor(Math.random() * uniqueDigit.length),
    );
  }
  return `${sanitizedString}${randomString}`;
};

export default generatePassword;
