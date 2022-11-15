"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import database client
const database_1 = __importDefault(require("../../database"));
// create dbCleaner function
const dbCleaner = async () => {
    // create array of all tables in database
    const tables = ['users', 'categories', 'products', 'orders', 'order_items'];
    try {
        // connect to database
        const conn = await database_1.default.connect();
        // delete content of each table in our tables array
        // and reset the primary keys
        tables.forEach(async (table) => {
            await conn.query(`TRUNCATE ${table} RESTART IDENTITY CASCADE`);
        });
        // disconnect from database
        conn.release();
    }
    catch (err) {
        // throw error if could not connect to database
        throw new Error(`Could not connect to database: ${err}`);
    }
};
exports.default = dbCleaner;
