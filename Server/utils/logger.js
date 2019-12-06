import Debug from 'debug';

export const logger = (namespace, message) => {
  const log = Debug(`${namespace}`);
  return log(`${message}`);
};
