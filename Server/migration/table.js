import '@babel/polyfill';
import db from '../config/pool';
import logger from '../utils';

const createUsersTable = `
  DROP TABLE IF EXISTS users CASCADE;
  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(128) NOT NULL,
    phone_number VARCHAR(11) NOT NULL,
    address VARCHAR(128) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false
);`;

const createPropertiesTable = `
  DROP TABLE IF EXISTS properties CASCADE;
  CREATE TABLE properties(
    id SERIAL PRIMARY KEY,
    owner INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'available',
    price NUMERIC NOT NULL,
    state VARCHAR(40) NOT NULL,
    city VARCHAR(40) NOT NULL,
    address VARCHAR(128) NOT NULL,
    created_on TEXT NOT NULL,
    image_url VARCHAR(128) NOT NULL,
    FOREIGN KEY (owner) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE
);`;

const createFlagsTable = `
  DROP TABLE IF EXISTS flags CASCADE;
  CREATE TABLE flags(
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL,
    reason VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    reported_by INT NOT NULL,
    created_on TEXT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES "properties" (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE
  );`;

const migrateDB = async () => {
  try {
    await db.query(
      `${createUsersTable} ${createPropertiesTable} ${createFlagsTable}`,
    );
    logger('migration:database', 'Table Created');
    process.exit();
  } catch (error) {
    logger('migration:database', `${error}: Table not created`);
  }
};

migrateDB();
