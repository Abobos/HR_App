import db from '../config/pool';

import { logger } from '../utils';

class UniversalModel {
  constructor(table) {
    this.resource = table;
  }

  async create(queryDetails) {
    const queryStatement = `INSERT INTO ${this.resource} (${queryDetails.columns}) VALUES(${queryDetails.values}) RETURNING *`;

    logger(`queryStatement:server`, queryStatement);

    const { rows } = await db.query(queryStatement);

    return rows[0];
  }

  async select(queryDetails) {
    const queryStatement = `SELECT ${queryDetails.columns} FROM ${this.resource} WHERE ${queryDetails.condition} ORDER BY DESC`;

    logger(`queryStatement:server`, queryStatement);

    const result = await db.query(queryStatement);

    return result;
  }

  async delete(queryDetails) {
    const queryStatement = `DELETE FROM ${this.resource} WHERE ${queryDetails.condition} RETURNING *`;

    logger(`queryStatement:server`, queryStatement);

    const result = await db.query(queryStatement);

    return result;
  }

  async update(queryDetails) {
    const queryStatement = `UPDATE ${this.resource} SET ${queryDetails.values} WHERE ${queryDetails.condition} RETURNING *`;

    logger(`queryStatement:server`, queryStatement);

    const { rows } = await db.query(queryStatement);

    return rows[0];
  }
}

export default UniversalModel;
