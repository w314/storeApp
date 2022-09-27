// import client from './../database'

// export type Order = {
//     order_id: number,
//     user_id: number,
//     order_status: string
// }

// export type OrderItem = {
//     item_id: number,
//     order_id: number,
//     product_id: number,
//     quantity: number
// }

// export class OrderStore {

//     async create(order: Order ) {
//         try {
//             const conn = await client.connect()
//             const sql = `INSERT INTO orders (user_id, order_status) VALUES ($1, $2)`
//             const result = await conn.query(sql, [order.user_id, order.order_status])
//             conn.release()
//             const ceatedOrder = result.rows[0]
//             return ceatedOrder
//         } catch (err) {
//             throw new Error(`Could not create order. Error: ${err}`)
//         }
//     }

//     async isActiveOrder(orderId: number): Promise<boolean> {
//         console.log(`in MODEL, in isAcitveOrder, orderID: ${orderId}`)
//         try {
//             const conn = await client.connect()
//             const sql = `SELECT order_status FROM orders WHERE order_id = $1`
//             const result = await conn.query(sql, [orderId])
//             conn.release()
//             const isActiveOrder = result.rows[0]
//             console.log(`in MODEL, returning; ${isActiveOrder}`)
//             return isActiveOrder
//         } catch (err) {
//             console.log(err)
//             throw new Error(`Could not check order status. Error: ${err}`)
//         }
//     }

//     // async addProduct(orderId: number, productId: number, quantity: number) {
//     async addProduct(orderItem: OrderItem): Promise<OrderItem> {
//         try {
//             // check if order is 'active' should not add items to completed orders
//             const conn = await client.connect()
//             const sqlOrder = `SELECT order_status FROM orders WHERE order_id = $1`
//             const order = await (await (conn.query(sqlOrder, [orderItem.order_id]))).rows[0]
//             if ( order.order_status == 'active') {
//                 const sql = `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)`
//                 const result = await conn.query(sql, [orderItem.order_id, orderItem.product_id, orderItem.quantity])
//                 conn.release()
//                 const orderProductAdded = result.rows[0]
//                 return orderProductAdded
//             }
//             // if order is completed throw error
//             else {
//                 conn.release()
//                 throw new Error(`Cannot add new item to completed order.`)
//             }
//         } catch (err) {
//             throw new Error(`Could not add product to order. Error: ${err}`)
//         }
//     }

//     async activeOrder(userId: number) {
//         try {
//             const conn = await client.connect()
//             const sql = `SELECT * FROM order_items
//                 INNER JOIN orders ON orders.order_id = order_items.order_id
//                 WHERE orders.user_id = $1 and orders.order_status = $2`
//             const result = await conn.query(sql, [userId, 'active'])
//             conn.release()
//             return result.rows
//         } catch(err) {
//             throw new Error(`Could not get active order. Error: ${err}`)
//         }
//     }

//     async  orderList(userId: number) {
//         try {
//             const conn = await client.connect()
//             const sql = `SELECT * FROM order_items
//             INNER JOIN orders ON orders.order_id = order_items.order_id
//             WHERE orders.user_id = $1 AND orders.order_status = $2`
//             const result = await conn.query(sql, [userId, 'completed'])
//             conn.release()
//             return result.rows
//         } catch (err) {
//             throw new Error(`Could not get list of completed orders. Error: ${err}`)
//         }
//     }
// }
