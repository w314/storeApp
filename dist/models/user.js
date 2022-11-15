"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
// import database client
const database_1 = __importDefault(require("../database"));
// import bcrypt for password encryption
const bcrypt_1 = __importDefault(require("bcrypt"));
// import dotenv to handle environment variables
const dotenv_1 = __importDefault(require("dotenv"));
// import jwt for authentication
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// initialize environment variables
dotenv_1.default.config();
const { PEPPER, SALT_ROUNDS, TOKEN_SECRET } = process.env;
/*
 a table in the database can be represended as a class
 CRUD actions are created as methods of the class
*/
// create UserStore class representing user table
class UserStore {
    /* add authenticate method for sign-in
       returns jwt token if sign-in is valid
       returns null if user name is invalid
       throws Error if password is incorrect */
    async authenticate(userName, password) {
        try {
            // connect to database
            const conn = await database_1.default.connect();
            // get user from database
            const sql = `SELECT * FROM users WHERE username = $1`;
            const result = await conn.query(sql, [userName]);
            // disconnect from database
            conn.release();
            // if result has nonzero length the username was valid
            if (result.rows.length) {
                // the user is:
                const user = result.rows[0];
                // compare user's password at sign-in with provided hashed version
                if (bcrypt_1.default.compareSync(password + PEPPER, user.password)) {
                    // password is valid create and send jwt token
                    return jsonwebtoken_1.default.sign(user, TOKEN_SECRET);
                }
                else {
                    // password was invalid
                    throw new Error(`Invalid password`);
                }
            }
            // result length was zero, username is invalid, return null
            return null;
        }
        catch (err) {
            console.log(`username was valid, but error at authentication: ${err}`);
            throw new Error(`Could not authenticate user. ${err}`);
        }
    }
    // add methods for CRUD actions
    // INDEX: give a list of all users
    async index() {
        try {
            // connect to database
            const conn = await database_1.default.connect();
            // get user list
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            // disconnect from database
            conn.release();
            // return user list
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get user list. Error: ${err}`);
        }
    }
    // SHOW: show one specific user
    async show(userId) {
        try {
            // connect to database
            const conn = await database_1.default.connect();
            // get user
            const sql = `SELECT * FROM users WHERE id = $1`;
            const result = await conn.query(sql, [userId]);
            // disconnect from database
            conn.release();
            // return user
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not get user. Error: ${err}`);
        }
    }
    // CREATE: create user and return created user
    async create(user) {
        try {
            // create password hash
            const hash = bcrypt_1.default.hashSync(user.password + PEPPER, parseInt(SALT_ROUNDS));
            // connect to database
            const conn = await database_1.default.connect();
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
        }
        catch (err) {
            throw new Error(`Couldn't create user. Error: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
