// import bcrypt for password encryption
import bcrypt from 'bcrypt';
// import database connection
import client from '../database';
// import dotenv to handle environment variables
import dotenv from 'dotenv';

// initialize environment variables
dotenv.config();
const pepper: string = process.env.BCRYPT_PASSWORD as string;
const saltRounds: string = process.env.SALT_ROUNDS as string;

// create typescript type for user
export type User = {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  password_digest: string;
};

// create Class representing table
export class UserStore {
  // add methods for CRUD actions

  async create(user: User): Promise<User> {
    try {
      // function for password encryption
      const hash = bcrypt.hashSync(
        user.password_digest + pepper,
        parseInt(saltRounds)
      );
      // connect to database
      const conn = await client.connect();
      // add user
      const sql = `INSERT INTO users (firstName, lastName, password_digest) 
                VALUES ($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [
        user.firstName,
        user.lastName,
        hash,
      ]);
      const createdUser = result.rows[0];

      // disconnect from database
      conn.release();

      return createdUser;
    } catch (err) {
      throw new Error(`Couldn't create user. Error: ${err}`);
    }
  }
}
