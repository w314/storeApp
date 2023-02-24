// import database client
import client from '../../database';
// import dotenv for using environmental variables
import dotenv from 'dotenv';
// import bcrypt for password encryption
import bcrypt from 'bcrypt';
// import dbCleaner to clear tables in the database
import dbCleaner from './dbCleaner';
// import mock dataset to enter to database
import mockDataSet from './mockDataSet';

// get environmental variables
dotenv.config();
const { PEPPER, SALT_ROUNDS } = process.env;

export class DbSetup {

  // this function enter all data from arrays into the appropriate tables
  setup = async () => {
    try {
      // clear tables in database
      await dbCleaner();

      // connect to database
      const conn = await client.connect();

      // add users
      // console.log(`users - populate users table`);
      mockDataSet.users.forEach(async (user) => {
        // encrypt password
        const hash = bcrypt.hashSync(
          user.password + PEPPER,
          parseInt(SALT_ROUNDS as string)
        );

        // console.log(`Inserting user: ${JSON.stringify(user, null, 4)}`);

        // use encrypted password to store in database
        await conn.query(
          `INSERT INTO users
                (username, firstname, lastname, password, user_type)
                VALUES ($1, $2, $3, $4, $5)`,
          [user.username, user.firstname, user.lastname, hash, user.user_type]
        );
      });

      // add categories
      // console.log(`categories - populate categories table`);
      mockDataSet.categories.forEach(async (category) => {
        // console.log(`Inserting category: ${JSON.stringify(category, null, 4)}`);
        await conn.query(
          `INSERT INTO categories
              (name)
              VALUES ($1)`,
          [category.name]
        );
      });

      // add products
      console.log(`products - populate products table`);
      mockDataSet.products.forEach(async (product) => {
        // console.log(`Inserting category: ${JSON.stringify(products, null, 4)}`);
        await conn.query(
          `INSERT INTO products
        (name, price, url, description, category_id )
        VALUES ($1, $2, $3, $4, $5)`,
          [
            product.name,
            product.price,
            product.url,
            product.description,
            product.category_id,
          ]
        );
      });

      // add orders
      // console.log(`orders - populate orders table`);
      mockDataSet.orders.forEach(async (order) => {
        await conn.query(
          `INSERT INTO orders
          (user_id, order_status)
          VALUES ($1, $2)`,
          [order.user_id, order.order_status]
        );
      });

      // add order_items
      // console.log(`order_item - populate order_item table`);
      mockDataSet.orderItems.forEach(async (orderItem) => {
        await conn.query(
          `INSERT INTO order_items
        (order_id, product_id, quantity)
        VALUES ($1, $2, $3)`,
          [orderItem.order_id, orderItem.product_id, orderItem.quantity]
        );
      });

      // disconnect from database
      conn.release();
      console.log(`\nDATABASE SETUP FINISHED`)
      return;
    } catch (err) {
      console.log(err);
      throw new Error(`Error setting up database for testing. Error: ${err}`);
    }
  };
}
