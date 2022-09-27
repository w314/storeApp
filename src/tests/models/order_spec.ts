// // import supertest from 'supertest'
// import { Order, OrderItem, OrderStore } from './../../models/order'
// import client from './../../database'
// import { DbSetup } from '../utilities/dbSetup'

// xdescribe('Order Model', () => {

//     const dbSetup = new DbSetup()
//     const orderStore = new OrderStore()

//     const newOrder: Order = {
//         order_id: dbSetup.orders.length + 1,
//         user_id: dbSetup.user.user_id,
//         order_status: 'active'
//     }

//     beforeAll( async () => {
//         // prepare database for testing
//         await dbSetup.setup()
//     })

//     it('has create method', () => {
//         expect(orderStore.create).toBeDefined()
//     })

//     it('can create order', async () => {
//         // create order
//         await orderStore.create(newOrder)
//         // check if order was created
//         const conn = await client.connect()
//         const result = await conn.query(`SELECT * FROM orders`)
//         conn.release()
//         // there shoud be 1 more order
//         expect(result.rows.length).toEqual(dbSetup.orders.length + 1)
//     })

//     it('has addProduct method', () => {
//         expect(orderStore.addProduct).toBeDefined()
//     })

//     it('can add product to active order', async () => {
//         // add new order_item to newly created order
//         const orderItem: OrderItem = {
//             item_id: 0,
//             order_id: newOrder.order_id,
//             product_id: dbSetup.products[0].product_id,
//             quantity: 4
//         }
//         await orderStore.addProduct(orderItem)
//         const conn = await client.connect()
//         const result = await conn.query(`SELECT * FROM order_items`)
//         // there should be one more order_itmes
//         expect(result.rows.length).toEqual(dbSetup.orderItems.length + 1)
//     })

//     // THIS DOES NOT WORK BELOW AND WHEN RUN GIVES ERROR MESSAGE EXPECTED HERE AT THE
//     // 'can show active or of user' test

//     // xit('throws error if trying to add new item to completed order', async () => {
//     //     // try to add new item to a completed order
//     //     // await orderStore.addProduct(dbSetup.completedOrder.order_id, dbSetup.products[1].product_id, 5)
//     //     await expect(async function() {await orderStore.addProduct(dbSetup.completedOrder.order_id, dbSetup.products[1].product_id, 5)}).toThrow(new Error('Cannot add new item to completed order.'))
//     //     // expect(async function() {await orderStore.addProduct(dbSetup.completedOrder.order_id, dbSetup.products[1].product_id, 5)}).toThrow()
//     // })

//     it('has activeOrder method', () => {
//         expect(orderStore.activeOrder).toBeDefined()
//     })

//     it('can show active order of user', async () => {
//         // test with order created in previouse tests by dbSetup. user with 1 item added
//         const activeOrder = await orderStore.activeOrder(newOrder.user_id)
//         expect(activeOrder.length).toEqual(1)
//     })

//     it('has orderList method', () => {
//         expect(orderStore.orderList).toBeDefined()
//     })

//     it('can show list of past orders of user', async () => {
//         // check for itesm in completed orders of dbSetup.user
//         const result = await orderStore.orderList(dbSetup.user.user_id)
//         expect(result.length).toEqual(dbSetup.numberOfItemsInCompletedOrdersOfUser)
//     })
// })
