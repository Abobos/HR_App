import db from '../config/pool';
import { InternalServerError } from '../exceptions';

class UniversalModel {
  constructor(table) {
    this.resource = table;
  }

  async create(queryDetails) {
    const queryStatement = `INSERT INTO ${this.resource} (${queryDetails.columns}) VALUES(${queryDetails.values}) RETURNING *`;
    console.log(queryStatement);
    const { rows } = await db.query(queryStatement);

    return rows[0];
  }

  async select(queryDetails) {
    const queryStatement = `SELECT ${queryDetails.columns} FROM ${this.resource} WHERE ${queryDetails.condition}`;
    console.log(queryStatement);
    const result = await db.query(queryStatement);

    return result;
  }

  async selectAll(queryDetails) {
    const queryStatement = `SELECT ${queryDetails.columns} FROM ${this.resource}
                            WHERE ${queryDetails.condition} LIMIT ${queryDetails.limit}
                            OFFSET ${queryDetails.offset} ORDER BY ${queryDetails.orderBy}`;
    console.log(queryStatement);
    const result = await db.query(queryStatement);

    return result;
  }

  async delete(queryDetails) {
    const queryStatement = `DELETE FROM ${this.resource} WHERE ${queryDetails.condition} RETURNING *`;
    const result = await db.query(queryStatement);
    console.log(queryStatement);
    return result;
  }

  async update(queryDetails) {
    const queryStatement = `UPDATE ${this.resource} SET ${queryDetails.values}
                            WHERE ${queryDetails.condition} RETURNING *`;
    console.log(queryStatement);
    const { rows } = await db.query(queryStatement);
    return rows[0];
  }
}

export default UniversalModel;
