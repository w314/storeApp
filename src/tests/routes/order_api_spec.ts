// import { agent as request } from 'supertest'
// import app from '../../server'
// import { DbSetup } from '../utilities/dbSetup'
// import { OrderItem } from '../../models/order'
// import client from '../../database'

// xdescribe('Order API Testing', () => {

//     const dbSetup = new DbSetup()

//     beforeAll( async () => {
//         // prepare database for testing
//         await dbSetup.setup()

//     })


//     it('GET /orders/:userId/active returns active order of user', (done) => {
//         request(app)
//         .get(`/orders/${dbSetup.activeOrder.user_id}/active`)
//         .expect(200)
//         .then((result) => {
//             expect(result.body.length).toEqual(dbSetup.numberOfItemsInActiveOrder)
//             done()
//         })
//         .catch((err) => {
//             done.fail(err)
//         })
//     })


//     it('GET /orders/:userId returns list of completed orders of user', (done) => {
//         request(app)
//         .get(`/orders/${dbSetup.user.user_id}`)
//         .expect(200)
//         .then((result) => {
//             expect(result.body.length).toEqual(dbSetup.numberOfItemsInCompletedOrdersOfUser)
//             done()
//         })
//         .catch((err) => {
//             done.fail(err)
//         })
//     })


//     fit('POST /orders/:userId/active adds new product item to active order', (done) => {

//         const activeOrder = dbSetup.activeOrder
//         const userId = dbSetup.activeOrder.user_id

//         const orderItem: OrderItem = {
//             item_id: 0,
//             order_id: activeOrder.order_id,
//             product_id: dbSetup.products[0].product_id,
//             quantity: 37
//         }

//         console.log(JSON.stringify(orderItem, null, 4))

//         request(app)
//         .post(`/orders/${userId}/active`)
//         .send(orderItem)
//         .expect(200)
//         .then((response) => {
//         //     // console.log(`result: ${JSON.stringify(result, null, 4)}_ null, 4)}`)
//         //     // console.log(`result.req: ${JSON.stringify(response.req.body, null, 4)}`)
//             expect(response.body.quantity).toEqual(orderItem.quantity)
//         //     // check that activeOrder has 1 more item
//         //     // const itemsCheck = async () => {            
//         //     //     try {

//         //     //         const conn =  await client.connect()
//         //     //         const sql = `SELECT * FROM order_items WHERE order_id = $1`
//         //     //         const result = await conn.query(sql, [activeOrder.order_id])
//         //     //         // console.log(result)
//         //     //         const activeOrderItems = result.rows
//         //     //         console.log(activeOrderItems.length)
//         //     //         console.log(dbSetup.numberOfItemsInActiveOrder + 1)
//         //     //         conn.release()
//         //     //         expect(activeOrderItems.length).toEqual(dbSetup.numberOfItemsInActiveOrder +  1)
//         //     //         done()
//         //     //     } catch (err) {
//         //     //         throw new Error (`Could not check items in the active order. Error: ${err}`)
//         //     //     }
    
//         //     // }
//         //     // itemsCheck()
//             done()
//         })
//         .catch((err) => {
//             console.log(err)
//             done.fail(err)
//         })
//     })
// })