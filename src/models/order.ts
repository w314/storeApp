// import database client
import client from './../database';

// create typescript type for order
export type Order = {
  id: number;
  user_id: number;
  order_status: string;
};

// create typescript type for orderItem
export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

// create class OrderStore handle order action
// by handling the orders and order_items tables of the database
export class OrderStore {
  // list of completed orders by user
  async completedOrders(userId: number) {
    try {
      // connect to database
      const conn = await client.connect();
      // get list of completed orders of user
      const sql = `SELECT * FROM order_items
            INNER JOIN orders ON orders.id = order_items.order_id
            WHERE orders.user_id = $1 AND orders.order_status = $2`;
      const result = await conn.query(sql, [userId, 'completed']);
      // disconnect from databse
      conn.release();
      // return list of completed orders
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get list of completed orders. Error: ${err}`);
    }
  }

  // get active order of user
  async activeOrder(userId: number) {
    try {
      // connect to database
      const conn = await client.connect();
      // get active order
      const sql = `SELECT * FROM order_items
                INNER JOIN orders ON orders.id = order_items.order_id
                WHERE orders.user_id = $1 and orders.order_status = $2`;
      const result = await conn.query(sql, [userId, 'active']);
      // disconnect from database
      conn.release();
      // return active order
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get active order. Error: ${err}`);
    }
  }

  // creates new order and returns created order
  async create(order: Order) {
    try {
      // check if the user alread has an active order
      if (await this.hasActiveOrder(order.user_id)) {
        // throw error as there can not be more then one active order order
        throw new Error('User has already have an active order');
      }
      // if there was no active order for user yet
      else {
        // connect to database
        const conn = await client.connect();
        // create order
        const result = await conn.query(
          `INSERT INTO orders (user_id, order_status) 
                    VALUES ($1, $2) RETURNING *`,
          [order.user_id, 'active']
        );
        const createdOrder = result.rows[0];
        // disconnect from database
        conn.release();
        // return cretatedOrders
        return createdOrder;
      }
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`);
    }
  }

  // checks if user has active order
  private async hasActiveOrder(userId: number): Promise<boolean> {
    // connect to database
    const conn = await client.connect();
    // get active order of user
    const activeOrder = await conn.query(
      `SELECT FROM orders WHERE user_id=$1 AND order_status=$2`,
      [userId, 'active']
    );
    // if the resulting activeOrder has nonzero length user has active order
    return activeOrder.rows.length > 0 ? true : false;
  }

  // TODO:  check if active order already has product and handle
  //        handle request as update on quantity

  // add new item to order and return order item created
  async addOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    try {
      // check if order is 'active' should not add items to completed orders
      if (await this.isOrderActive(orderItem.order_id)) {
        // connect to database
        const conn = await client.connect();
        const result = await conn.query(
          `INSERT INTO order_items (order_id, product_id, quantity)
                     VALUES ($1, $2, $3) RETURNING *`,
          [orderItem.order_id, orderItem.product_id, orderItem.quantity]
        );
        const orderItemAdded = result.rows[0];
        // disconnect from database
        conn.release();
        // return added orderItem
        return orderItemAdded;
      }
      // if order is completed throw error
      else {
        throw new Error(`Cannot add new item to completed order.`);
      }
    } catch (err) {
      throw new Error(`Could not add product to order. Error: ${err}`);
    }
  }

  // function to determine in order is active
  private async isOrderActive(orderId: number): Promise<boolean | null> {
    // console.log(`in MODEL, in isAcitveOrder, orderID: ${orderId}`)
    try {
      // connect to database
      const conn = await client.connect();
      // select order from database
      const sql = `SELECT order_status FROM orders WHERE id = $1`;
      const result = await conn.query(sql, [orderId]);
      // disconnect from database
      conn.release();
      // if there was the order was not in the database return null
      if (result.rows.length === 0) {
        console.log(`There was no order with order id:${orderId}`);
        return null;
      }

      // get order status and return result based on status
      const orderStatus = result.rows[0];
      return orderStatus.order_status === 'active' ? true : false;
    } catch (err) {
      console.log(err);
      throw new Error(`Could not check order status. Error: ${err}`);
    }
  }
}
