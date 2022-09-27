// import database clint
import client from '../database';

// create typescript type for Category
export type Category = {
  id: number;
  name: string;
};

// create class CategoryStore to represent categories table
export class CategoryStore {
  // CREATE method to create new category
  async create(name: string): Promise<Category> {
    try {
      // connect to database
      const conn = await client.connect();
      // insert new category to database
      const sql = `INSERT INTO categories
                (name) VALUES ($1) RETURNING *`;
      const result = await conn.query(sql, [name]);
      // store the returned category created
      const categoryCreated = result.rows[0];
      // disconnect from database
      conn.release();
      // return new category created
      return categoryCreated;
    } catch (err) {
      console.log(`ERROR IN CATEGORY MODEL: ${err}`);
      throw new Error(`Cannot create category. Error: ${err}`);
    }
  }
}
