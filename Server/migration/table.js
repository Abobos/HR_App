import '@babel/polyfill';
import db from '../config/pool';
import logger from '../utils/index';

const hrs = `
  DROP TABLE IF EXISTS hrs CASCADE;
  CREATE TABLE hrs(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(128) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false
);`;

// const templates = `
//   DROP TABLE IF EXISTS templates CASCADE;
//   CREATE TABLE templates(
//     id SERIAL PRIMARY KEY,
//     template_name VARCHAR(128) NOT NULL,
//     owner INT NOT NULL,
//     status NOT NULL DEFAULT 'save',
//     last_modified TIMESTAMP NOT NULL,
// );`;

// const documents = `
//     DROP TABLE IF EXITS documents CASCADE;
//     CREATE TABLE documents(
//       id SERIAL PRIMARY KEY,
//       document_name VARCHAR(128) NOT NULL,
//       owner INT NOT NULL,
//       recipients VARCHAR(128) NOT NULL,
//       last_modified date,
//       status VARCHAR(128) NOT NULL DEFAULT 'draft',
//       template_id NOT NULL
//     );`;

const migrateDB = async () => {
  try {
    await db.query(`${hrs}`);
    logger('migration:database', 'Table Created');
  } catch (error) {
    logger('migration:database', `${error}: Table not created`);
    process.exit(1);
  }
};

migrateDB();
