import '@babel/polyfill';
import db from '../config/pool';
import { logger } from '../utils';

const hrs = `
  DROP TABLE IF EXISTS hrs CASCADE;
  CREATE TABLE hrs(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(128),
    last_name VARCHAR(128),
    email VARCHAR(60) NOT NULL,
    password VARCHAR(128) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT true,
    created_at DATE NOT NULL DEFAULT NOW()
);`;

const templates = `
  DROP TABLE IF EXISTS templates CASCADE;
  CREATE TABLE templates(
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    owner INT NOT NULL,
    status VARCHAR(128) NOT NULL,
    recipient VARCHAR(50) NOT NULL,
    file_name VARCHAR(60), 
        created_at DATE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (owner) REFERENCES "hrs" (id) ON UPDATE CASCADE ON DELETE CASCADE
);`;

const documents = `
    DROP TABLE IF EXISTS documents CASCADE;
    CREATE TABLE documents(
      id SERIAL PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      owner INT NOT NULL,
      status VARCHAR(128) NOT NULL DEFAULT 'in-progress',
      template_id INT NOT NULL,
        created_at DATE NOT NULL DEFAULT NOW(),
      FOREIGN KEY (template_id) REFERENCES "templates" (id) ON UPDATE CASCADE ON DELETE CASCADE
    );`;

const migrateDB = async () => {
  try {
    await db.query(`${hrs} ${templates} ${documents}`);
    logger('migration:database', 'Table Created');
  } catch (error) {
    logger('migration:database', `${error}: Table not created`);
    process.exit(1);
  }
};

migrateDB();
