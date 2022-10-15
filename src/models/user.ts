// import database client
import client from '../database';
// import bcrypt for password encryption
import bcrypt from 'bcrypt';
// import dotenv to handle environment variables
import dotenv from 'dotenv';
// import jwt for authentication
import jsonwebtoken from 'jsonwebtoken';

// initialize environment variables
dotenv.config();
const { PEPPER, SALT_ROUNDS, TOKEN_SECRET } = process.env;

// create typescript type for user
export type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  user_type: string;
};

/*
 a table in the database can be represended as a class
 CRUD actions are created as methods of the class
*/

// create UserStore class representing user table
export class UserStore {
  /* add authenticate method for sign-in
     returns jwt token if sign-in is valid
     returns null if user name is invalid
     throws Error if password is incorrect */
  async authenticate(
    userName: string,
    password: string
  ): Promise<string | null> {
    try {
      // connect to database
      const conn = await client.connect();
      // get user from database
      const sql = `SELECT * FROM users WHERE username = $1`;
      const result = await conn.query(sql, [userName]);

      // disconnect from database
      conn.release();

      // if result has nonzero length the username was valid
      if (result.rows.length) {
        // the user is:
        const user: User = result.rows[0];

        // compare user's password at sign-in with provided hashed version
        if (bcrypt.compareSync(password + PEPPER, user.password)) {
          // password is valid create and send jwt token
          return jsonwebtoken.sign(user, TOKEN_SECRET as string);
        } else {
          // password was invalid
          throw new Error(`Invalid password`);
        }
      }
      // result length was zero, username is invalid, return null
      return null;
    } catch (err) {
      console.log(`username was valid, but error at authentication: ${err}`);
      throw new Error(`Could not authenticate user. ${err}`);
    }
  }

  // add methods for CRUD actions

  // INDEX: give a list of all users
  async index(): Promise<User[]> {
    try {
      // connect to database
      const conn = await client.connect();
      // get user list
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      // disconnect from database
      conn.release();
      // return user list
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get user list. Error: ${err}`);
    }
  }

  // SHOW: show one specific user
  async show(userId: number): Promise<User> {
    try {
      // connect to database
      const conn = await client.connect();
      // get user
      const sql = `SELECT * FROM users WHERE id = $1`;
      const result = await conn.query(sql, [userId]);
      // disconnect from database
      conn.release();
      // return user
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get user. Error: ${err}`);
    }
  }

  // CREATE: create user and return created user
  async create(user: User): Promise<User> {
    try {
      // create password hash
      const hash = bcrypt.hashSync(
        user.password + PEPPER,
        parseInt(SALT_ROUNDS as string)
      );
      // connect to database
      const conn = await client.connect();
      // sql command to insert user
      const sql = `INSERT INTO users (username, firstname, lastname, password, user_type)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      // run command and capture returned user
      const result = await conn.query(sql, [
        user.username,
        user.firstname,
        user.lastname,
        hash,
        user.user_type,
      ]);
      const createdUser = result.rows[0];

      // disconnect from database
      conn.release();

      // return created user
      return createdUser;
    } catch (err) {
      throw new Error(`Couldn't create user. Error: ${err}`);
    }
  }
}
