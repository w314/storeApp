// import database connection
import client from '../database';


// creating a TypeScipt type for our table items
export type Product = {
  product_id: number;
  name: string;
  price: number;
  category_id: number;
};

/*
 a table in the database can be represended as a class
 CRUD actions are created as methods of the class
*/
export class ProductStore {
  // READ - INDEX
  async index(): Promise<Product[]> {
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
    } catch (err) {
      throw new Error(`Cannot get products. Error: ${err}`);
    }
  }

  // SHOW
  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products WHERE product_id=($1)`;
      const product = await conn.query(sql, [id]);
      conn.release();
      return product.rows[0];
    } catch (err) {
      throw new Error(`Cannot get product ${id}. Error: ${err}`);
    }
  }
  // CREATE
  async create(product: Product): Promise<Product> {
    try {
      // console.log(`IN PRODUCT MODEL product: \n ${JSON.stringify(product, null, 4)}`)
      const conn = await client.connect();
      const sql = `INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [product.name, product.price, product.category_id]);
      const createdProduct = result.rows[0];  
      conn.release();
      // console.log(`RESULT: ${result.rows[0]}`)
      // console.log(`RETURNING CREATED PRODUCT FROM MODEL:\n ${JSON.stringify(createdProduct, null, 4)}`)
      return createdProduct
    } catch (err) {
      console.log(`ERROR in PRODUCT MODEL: ${err})`)
      throw new Error(
        `Could not create product ${product.name}. Error: ${err}`
      );
    }
  }

  // UPDATE
  async update(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = `UPDATE products 
            SET name=($2), price=($3), category_id=($4) 
            WHERE product_id=($1) RETURNING *`;
      const result = await conn.query(sql, [
        product.product_id,
        product.name,
        product.price,
        product.category_id
      ]);
      const updatedProduct = result.rows[0];
      conn.release();
      return updatedProduct;
    } catch (err) {
      throw new Error(
        `Could not update product ${product.name}. Error: ${err}`
      );
    }
  }
  // // delet doesn't work because of foreign key on delete restrict constraint
  // // DELETE
  // async delete(product: Product): Promise<Product> {
  //   try {
  //     const conn = await client.connect();
  //     const sql = `DELETE FROM products WHERE product_id=($1)`;
  //     await conn.query(sql, [product.product_id]);
  //     conn.release();
  //     return product;
  //   } catch (err) {
  //     throw new Error(`Cannot delete prodcut ${product.name}. Error: ${err}`);
  //   }
  // }
}
