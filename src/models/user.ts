// import bcrypt for password encryption
import bcrypt from 'bcrypt';
// import database connection
import client from '../database';
// import dotenv to handle environment variables
import dotenv from 'dotenv';
// import jwt for authentication
import jsonwebtoken from 'jsonwebtoken';

// initialize environment variables
dotenv.config();
const pepper: string = process.env.BCRYPT_PASSWORD as string;
const saltRounds: string = process.env.SALT_ROUNDS as string;
const tokenSecret: string = process.env.TOKEN_SECRET as string;

// create typescript type for user
export type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password_digest: string;
};

// create Class representing table
export class UserStore {
  // add authenticate method for sign-in
  // returns jwt token if valid sign-in, null if user name is invalid, Error if password is incorrect
  async authenticate(username: string, password: string): Promise<string | null> {
    try {
      // get user from database
      const conn = await client.connect();
      const sql = `SELECT * FROM users WHERE userName = $1`;
      const result = await conn.query(sql, [username]);
      // disconnect from database
      conn.release();
      // if userName is valid and we got a password back
      if (result.rows.length) {
        const user: User = result.rows[0];
        // compare user's password at sign-in with provided hashed version
        // if password is valid send jwt token
        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          // create JWT token and return it
          // console.log(`password OK`)
          return jsonwebtoken.sign(user, tokenSecret)         
        }
        // in case of invalid password throw error 
        else {
          // console.log('wrong password')
          throw new Error(`Invalid password`)
        }
      }
      // if userName is invalid return null
      return null;
    } catch (err) {
      console.log(`username was valid, but error at authentication: ${err}`)
      throw new Error(`Could not authenticate user. ${err}`);
    }
  }

  // add methods for CRUD actions

  // index: give a list of all users
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
      throw new Error(`Could not get use list. Error: ${err}`);
    }
  }

  // show one specific user
  async show(userId: number): Promise <User> {
    try {
      // connect to database
      const conn = await client.connect()
      // get user
      const sql = `SELECT * FROM users WHERE id = $1`
      const result = await conn.query(sql, [userId])
      // disconnect from database
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get user. Error: ${err}`)
    }
  }  

  // create user and return created user
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
      const sql = `INSERT INTO users (userName, firstName, lastName, password_digest) 
                VALUES ($1, $2, $3, $4) RETURNING *`;
      const result = await conn.query(sql, [
        user.username,
        user.firstname,
        user.lastname,
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
