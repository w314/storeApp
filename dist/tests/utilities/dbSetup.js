"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbSetup = void 0;
// import database client
const database_1 = __importDefault(require("../../database"));
// import dotenv for using environmental variables
const dotenv_1 = __importDefault(require("dotenv"));
// import bcrypt for password encryption
const bcrypt_1 = __importDefault(require("bcrypt"));
// import dbCleaner to clear tables in the database
const dbCleaner_1 = __importDefault(require("./dbCleaner"));
// import mock dataset to enter to database
const mockDataSet_1 = __importDefault(require("./mockDataSet"));
// get environmental variables
dotenv_1.default.config();
const { PEPPER, SALT_ROUNDS } = process.env;
class DbSetup {
    constructor() {
        // this function enter all data from arrays into the appropriate tables
        this.setup = async () => {
            try {
                // clear tables in database
                await (0, dbCleaner_1.default)();
                // connect to database
                const conn = await database_1.default.connect();
                // add users
                // console.log(`users - populate users table`);
                mockDataSet_1.default.users.forEach(async (user) => {
                    // encrypt password
                    const hash = bcrypt_1.default.hashSync(user.password + PEPPER, parseInt(SALT_ROUNDS));
                    // console.log(`Inserting user: ${JSON.stringify(user, null, 4)}`);
                    // use encrypted password to store in database
                    await conn.query(`INSERT INTO users
                (username, firstname, lastname, password, user_type)
                VALUES ($1, $2, $3, $4, $5)`, [user.username, user.firstname, user.lastname, hash, user.user_type]);
                });
                // add categories
                // console.log(`categories - populate categories table`);
                mockDataSet_1.default.categories.forEach(async (category) => {
                    // console.log(`Inserting category: ${JSON.stringify(category, null, 4)}`);
                    await conn.query(`INSERT INTO categories
              (name)
              VALUES ($1)`, [category.name]);
                });
                // add products
                console.log(`products - populate products table`);
                mockDataSet_1.default.products.forEach(async (product) => {
                    // console.log(`Inserting category: ${JSON.stringify(products, null, 4)}`);
                    await conn.query(`INSERT INTO products
        (name, price, url, description, category_id )
        VALUES ($1, $2, $3, $4, $5)`, [
                        product.name,
                        product.price,
                        product.url,
                        product.description,
                        product.category_id,
                    ]);
                });
                // add orders
                // console.log(`orders - populate orders table`);
                mockDataSet_1.default.orders.forEach(async (order) => {
                    await conn.query(`INSERT INTO orders
          (user_id, order_status)
          VALUES ($1, $2)`, [order.user_id, order.order_status]);
                });
                // add order_items
                // console.log(`order_item - populate order_item table`);
                mockDataSet_1.default.orderItems.forEach(async (orderItem) => {
                    await conn.query(`INSERT INTO order_items
        (order_id, product_id, quantity)
        VALUES ($1, $2, $3)`, [orderItem.order_id, orderItem.product_id, orderItem.quantity]);
                });
                // disconnect from database
                conn.release();
                console.log(`\nDATABASE SETUP FINISHED`);
                return;
            }
            catch (err) {
                console.log(err);
                throw new Error(`Error setting up database for testing. Error: ${err}`);
            }
        };
    }
}
exports.DbSetup = DbSetup;
