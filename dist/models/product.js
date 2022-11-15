"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
// import database connection
const database_1 = __importDefault(require("../database"));
/*
 a table in the database can be represended as a class
 CRUD actions are created as methods of the class
*/
// create ProductStore class to represent the products table
class ProductStore {
    // INDEX returns a list of all products in the database
    async index() {
        try {
            // open connection to db
            const conn = await database_1.default.connect();
            // sql command we want to execute
            const sql = 'SELECT * FROM products';
            // run query on database
            const result = await conn.query(sql);
            // close database connection
            conn.release();
            // return query result
            return result.rows;
        }
        catch (err) {
            throw new Error(`Cannot get products. Error: ${err}`);
        }
    }
    // SHOW returns the product with the requested id number
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = `SELECT * FROM products WHERE id=($1)`;
            const product = await conn.query(sql, [id]);
            conn.release();
            return product.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot get product ${id}. Error: ${err}`);
        }
    }
    // CREATE inserts a new product into the database
    async create(product) {
        try {
            // connect to database
            const conn = await database_1.default.connect();
            // insert product
            const sql = `INSERT INTO products (name, price, url, description, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const result = await conn.query(sql, [
                product.name,
                product.price,
                product.url,
                product.description,
                product.category_id,
            ]);
            // store returned created product
            const createdProduct = result.rows[0];
            // disconnect from database
            conn.release();
            // return created product
            return createdProduct;
        }
        catch (err) {
            console.log(`ERROR in PRODUCT MODEL: ${err})`);
            throw new Error(`Could not create product ${product.name}. Error: ${err}`);
        }
    }
    // UPDATEL: edits existing product and returns the updated product
    async update(product) {
        try {
            // connect to database
            const conn = await database_1.default.connect();
            // update product
            const sql = `UPDATE products
            SET name=($2), price=($3), url=($4), description=($5), category_id=($6)
            WHERE id=($1) RETURNING *`;
            const result = await conn.query(sql, [
                product.id,
                product.name,
                product.price,
                product.url,
                product.description,
                product.category_id,
            ]);
            // store updated product
            const updatedProduct = result.rows[0];
            // disconnect from database
            conn.release();
            // return updated product
            return updatedProduct;
        }
        catch (err) {
            throw new Error(`Could not update product ${product.name}. Error: ${err}`);
        }
    }
    // DELETE: deletes product from products table and returns deleted product
    async delete(product) {
        try {
            // connect to database
            const conn = await database_1.default.connect();
            // delete product
            const sql = `DELETE FROM products WHERE id=($1) RETURNING *`;
            const result = await conn.query(sql, [product.id]);
            // disconnect from database
            conn.release();
            // return deleted product
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot delete prodcut ${product.name}. Error: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
