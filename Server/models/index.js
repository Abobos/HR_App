import db from '../config/pool';

class UniversalModel {
  constructor(table) {
    this.resource = table;
  }

  async create(queryDetails) {
    const queryStatement = `INSERT INTO ${this.resource} (${queryDetails.column}) 
                            VALUES (${queryDetails.values}) RETURNING *`;

    const { rows } = await db.query(queryStatement);

    return rows[0];
  }

  async select(queryDetails) {
    const queryStatement = `SELECT ${queryDetails.column} FROM ${this.resource}
                            WHERE ${queryDetails.condition}`;
    const result = await db.query(queryStatement);

    return result.rows;
  }

  async selectAll(queryDetails) {
    const queryStatement = `SELECT ${queryDetails.column} FROM ${this.resource}
                            WHERE ${queryDetails.condition} LIMIT ${queryDetails.limit} 
                            OFFSET ${queryDetails.offset} ORDER BY ${queryDetails.orderBy}`;

    const result = await db.query(queryStatement);

    return result;
  }

  async delete(queryDetails) {
    const queryStatement = `DELETE FROM ${this.resource} WHERE ${queryDetails.condition} RETURNING *`;
    const result = await db.query(queryStatement);

    return result;
  }

  async update(queryDetails) {
    const queryStatement = `UPDATE ${this.resource} SET ${queryDetails.values} 
                            WHERE ${queryDetails.condition} RETURNING *`;

    const { rows } = await db.query(queryStatement);
    return rows[0];
  }
}

export default UniversalModel;
