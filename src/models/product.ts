// import database connection
import client from '../database'

// creating a TypeScipt type for our table items
export type Product = {
    id : Number;
    name : string;
    price: Number;
}

/*
 a table in the database can be represended as a class
 CRUD actions are created as methods of the class
*/
export class ProductStore {
  // READ - INDEX
  async index(): Promise<Product[]>{
    try {
      // open connection to db
      const conn = await client.connect();
      // sql command we want to execute
      const sql = 'SELECT * FROM products';
      // run query on database
      const result = await conn.query(sql);
      // close database connection
      conn.release();
      // return query result
      return result.rows;
    } catch(err) {
      throw new Error(`Cannot get products. Error: ${err}`);
    } 
  }

  // SHOW
  async show(id: string):Promise<Product> {
      try {
          const conn = await client.connect();
          const sql = `SELECT * FROM TABLE products WHERE id=($1)`;
          const product = await conn.query(sql,[id])
          conn.release();
          return product.rows[0];
      } catch(err) {
          throw new Error(`Cannot get product ${id}. Error: ${err}`);
      }
  }
  // CREATE
  async create(product:Product):Promise<Product> {
    try {
        const conn = await client.connect();
        const sql = `INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *`;
        const result = await conn.query(sql,[product.name, product.price]);
        const createdProduct = result.rows[0];
        conn.release();
        return createdProduct
    } catch(err) {
        throw new Error(`Could not create product ${product.name}. Error: ${err}`);
    }
  }

  // UPDATE
  async update(product:Product):Promise<Product> {
      try {
        const conn = await client.connect();
        const sql = 
            `UPDATE TABLE products 
            SET name=($2), price=($3) 
            WHERE id=($1) RETURNING *`
        const result = await conn.query(sql,[product.id, product.name, product.price]);
        const updatedProduct = result.rows[0]
        conn.release();
        return updatedProduct
      } catch(err) {
          throw new Error(`Coul not update product ${product.name}. Error: ${err}`);
      }
  }
  // DELETE
  async delete(product:Product):Promise<Product> {
      try {
        const conn = await client.connect();
        const sql = `SELECT * FROM products WHERE id=($1)`;
        await conn.query(sql,[product.id]);
        conn.release();
        return product
      } catch(err) {
          throw new Error(`Cannot delete prodcut ${product.name}. Error: ${err}`);
      }
  }

}