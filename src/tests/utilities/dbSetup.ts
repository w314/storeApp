// import database client
import client from '../../database';
// Import User Model
import { User } from '../../models/user';
// import Category Model
import { Category } from '../../models/category';
//import Product Model
import { Product } from '../../models/product';
// import types Order and OrderItem
import { Order, OrderItem } from '../../models/order';
// import dotenv for using environmental variables
import dotenv from 'dotenv';
// import bcrypt for password encryption
import bcrypt from 'bcrypt';
// import dbCleaner to clear tables in the database
import dbCleaner from './dbCleaner';
// import { userInfo } from 'os'

// get environmental variables
dotenv.config();
const { PEPPER, SALT_ROUNDS } = process.env;

export class DbSetup {
  // tables will be created with data in arrays below

  users: User[] = [
    {
      id: 1,
      username: 'admin',
      firstname: 'Ed',
      lastname: 'Mint',
      password: 'difficult',
      user_type: 'admin',
    },
    {
      id: 2,
      username: 'bob',
      firstname: 'bob',
      lastname: 'bobek',
      password: '1234',
      user_type: 'regular',
    },
    {
      id: 3,
      username: 'userWithActiveOrder',
      firstname: 'bob',
      lastname: 'bobek',
      password: '1234',
      user_type: 'regular',
    },
  ];

  /*
        Creates an admin and two users. 
        Regular user "user" will only have completed orders.
        Regular user "userWithActiveOrder" will have and active order
    */
  // administrator
  admin: User = this.users.filter(function (user) {
    return user.user_type == 'admin';
  })[0];
  // regular user without active order
  user: User = this.users.filter(function (user) {
    return user.user_type == 'regular';
  })[0];
  // regular user with active order in database
  userWithActiveOrder: User = this.users.filter(user => 
    user.username === 'userWithActiveOrder' && user.user_type === 'regular'
  )[0]


  categories: Category[] = [
    { id: 1, name: 'Books' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Clothing' },
    { id: 4, name: 'Garden & Outdoors' },
    { id: 5, name: 'Appliances' },
    { id: 6, name: 'Pet Supplies' },
    { id: 7, name: 'Home & Kitchen' },
    { id: 8, name: 'Accessories' },
  ];

  products: Product[] = [
    {
      id: 1,
      name: 'Foundation',
      price: 9.98,
      url: 'none',
      description: 'Great book. The foundation for your sci-fi knowledge.',
      category_id: 1,
    },
    {
      id: 2,
      name: "Hitchhiker's Guide to the Galaxy",
      price: 42,
      url: 'none',
      description: 'Number one book for travellers.',
      category_id: 1,
    },
    {
      id: 3,
      name: 'Dishwasher',
      price: 462,
      url: 'none',
      description: 'For those haters of doing the dishes',
      category_id: 5,
    },
    {
      id: 4,
      name: 'Leash',
      price: 12,
      url: 'none',
      description: 'For those against freedom for dogs.',
      category_id: 6,
    },
    {
      id: 5,
      name: 'Hoe',
      price: 92.98,
      url: 'none',
      description: 'For those yearning for a deep connection to earth.',
      category_id: 4,
    },
    {
      id: 6,
      name: 'Book',
      price: 9.99,
      url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'You can read it!',
      category_id: 1,
    },
    {
      id: 7,
      name: 'Headphones',
      price: 249.99,
      url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Listen to stuff!',
      category_id: 2,
    },
    {
      id: 8,
      name: 'Backpack',
      price: 79.99,
      url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Carry things around town!',
      category_id: 8,
    },
    {
      id: 9,
      name: 'Glasses',
      price: 129.99,
      url: 'https://images.unsplashcom/photo-1591076482161-42ce6da69f67?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Now you can see!',
      category_id: 8,
    },
    {
      id: 10,
      name: 'Cup',
      price: 4.99,
      url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Drink anything with it!',
      category_id: 7,
    },
    {
      id: 11,
      name: 'Shirt',
      price: 29.99,
      url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80',
      description: 'Wear it with style!',
      category_id: 3,
    },
  ];

  orders: Order[] = [
    { id: 1, user_id: this.admin.id, order_status: 'completed' },
    { id: 2, user_id: this.admin.id, order_status: 'completed' },
    { id: 3, user_id: this.user.id, order_status: 'completed' },
    { id: 4, user_id: this.user.id, order_status: 'completed' },
    { id: 5, user_id: this.user.id, order_status: 'completed' },
    { id: 6, user_id: this.userWithActiveOrder.id, order_status: 'active' }
  ];

  // the variables below are used in specs

  // variable for an active order
  activeOrder = this.orders.filter(
    (order) =>  order.order_status == 'active')[0];
  
  // // variable for a completed order
  // completedOrder = this.orders.filter(function(order) { return order.order_status == 'completed' })[0]

  orderItems: OrderItem[] = [
    { id: 1, order_id: 1, product_id: 2, quantity: 12 },
    { id: 2, order_id: 2, product_id: 1, quantity: 2 },
    { id: 3, order_id: 2, product_id: 2, quantity: 112 },
    { id: 4, order_id: 3, product_id: 1, quantity: 1 },
    { id: 5, order_id: 3, product_id: 2, quantity: 2 },
    { id: 6, order_id: 3, product_id: 3, quantity: 9 },
    { id: 7, order_id: 4, product_id: 2, quantity: 7 },
    { id: 8, order_id: 4, product_id: 3, quantity: 6 },
    { id: 9, order_id: 4, product_id: 1, quantity: 4 },
    { id: 10, order_id: 5, product_id: 2, quantity: 13 },
    { id: 11, order_id: 5, product_id: 3, quantity: 78 },
    { id: 12, order_id: 5, product_id: 4, quantity: 4 },
    { id: 13, order_id: 5, product_id: 5, quantity: 3 },
    { id: 14, order_id: 5, product_id: 1, quantity: 1 },
    { id: 15, order_id: this.activeOrder.id, product_id: 3, quantity: 2 },
    { id: 16, order_id: this.activeOrder.id, product_id: 5, quantity: 7 },
    { id: 17, order_id: this.activeOrder.id, product_id: 2, quantity: 3 },
    { id: 18, order_id: this.activeOrder.id, product_id: 2, quantity: 3 },
    { id: 19, order_id: this.activeOrder.id, product_id: 2, quantity: 3 },
  ];

  // the variables below are used in specs

  // count all the items in the only active order in the dataset
  numberOfItemsInActiveOrder = this.orderItems.reduce(
    (total, currentItem) =>
      currentItem.order_id == this.activeOrder.id ? total + 1 : total,
    0
  );

  // determine the number of items in all the completed orders of user

  // function to filter order id's of completed orders created by dbSetup.user
  isCompletedByUser = (order: Order) => {
    if (order.order_status == 'completed' && order.user_id == this.user.id) {
      return order.id;
    }
    return false;
  };
  // set of orderId of completed orders created by dbSetup.user
  completedOrders = new Set(
    this.orders.map((order) => {
      if (
        order.user_id === this.user.id &&
        order.order_status === 'completed'
      ) {
        return order.id;
      }
    })
  );

  // count all items in all the completed orders of user
  numberOfItemsInCompletedOrders = this.orderItems.reduce(
    (total, currentItem) =>
      this.completedOrders.has(currentItem.order_id) ? total + 1 : total,
    0
  );

  // this function enter all data from arrays into the appropriate tables
  setup = async () => {
    try {
      // clear tables in database
      await dbCleaner();

      // connect to database
      const conn = await client.connect();

      // add users
      // console.log(`users - populate users table`);
      this.users.forEach(async (user) => {
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
      this.categories.forEach(async (category) => {
        // console.log(`Inserting category: ${JSON.stringify(category, null, 4)}`);
        await conn.query(
          `INSERT INTO categories
              (name)
              VALUES ($1)`,
          [category.name]
        );
      });

      // add products
      // console.log(`products - populate products table`);
      this.products.forEach(async (product) => {
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
      this.orders.forEach(async (order) => {
        await conn.query(
          `INSERT INTO orders
          (user_id, order_status)
          VALUES ($1, $2)`,
          [order.user_id, order.order_status]
        );
      });

      // add order_items
      // console.log(`order_item - populate order_item table`);
      this.orderItems.forEach(async (orderItem) => {
        await conn.query(
          `INSERT INTO order_items
        (order_id, product_id, quantity)
        VALUES ($1, $2, $3)`,
          [orderItem.order_id, orderItem.product_id, orderItem.quantity]
        );
      });

      // disconnect from database
      conn.release();
      return;
    } catch (err) {
      console.log(err);
      throw new Error(`Error setting up database for testing. Error: ${err}`);
    }
  };
}
