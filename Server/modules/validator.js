import { removedash } from '../utils';

export const emailRegex = /^[A-Za-z0-9.-_]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

export const passwordRegex = /(?=^.{8,}$)(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[0-9].*)/;

export const nameRegex = /^[a-zA-Z]+$/;

export const magicTrimmer = payload => {
  const data = {};

  Object.keys(payload).forEach(key => {
    const value = payload[key];
    Object.assign(data, { [key]: value.trim() });
  });

  return data;
};

export const validateAgainstRegex = (value, regex, regexType) => {
  let errorMessage = '';

  if (!value) return null;

  switch (regexType) {
    case 'password': {
      errorMessage =
        'password must contain at least eight characters, one Uppercase letter, one lowercase letter, and one digit';
      break;
    }

    default: {
      errorMessage = `${regexType} is not valid`;
      break;
    }
  }

  if (!regex.test(value)) return errorMessage;

  return undefined;
};

export const errorChecker = payload => {
  const result = {};

  Object.keys(payload).forEach(key => {
    if (payload[key]) {
      result[key] = payload[key];
    } else if (payload[key] === null) {
      const strippedKey = removedash(key);
      result[key] = `${strippedKey} is required`;
    }
  });

  return Object.keys(result).length ? result : null;
};
