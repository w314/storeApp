"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryStore = void 0;
// import database clint
const database_1 = __importDefault(require("../database"));
// create class CategoryStore to represent categories table
class CategoryStore {
    // CREATE method to create new category
    async create(name) {
        try {
            // connect to database
            const conn = await database_1.default.connect();
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
        }
        catch (err) {
            console.log(`ERROR IN CATEGORY MODEL: ${err}`);
            throw new Error(`Cannot create category. Error: ${err}`);
        }
    }
}
exports.CategoryStore = CategoryStore;
