import Debug from 'debug';

const logger = (namespace, message) => {
  const log = Debug(`${namespace}`);
  return log(`${message}`);
};

export default logger;
