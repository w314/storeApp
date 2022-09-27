// import { Order, OrderItem, OrderStore } from './../models/order'
// import express from 'express'

// const orderStore = new OrderStore

// const create = async (req:express.Request, res:express.Response) => {

//     const order = {
//         order_id: 0,
//         user_id: parseInt(req.params.id),
//         order_status: 'active'
//     }

//     try {
//         const orderCreated = await orderStore.create(order)
//         res.json(orderCreated)
//         return
//     } catch (err) {
//         res.sendStatus(500)
//         res.json(err)
//         return
//     }
// }

// const activeOrder = async (req: express.Request, res: express.Response) =>  {

//     const userId = parseInt(req.params.userId)

//     try {
//         const activeOrder = await orderStore.activeOrder(userId)
//         res.json(activeOrder)
//         return
//     } catch (err) {
//         res.sendStatus(500)
//         res.json(err)
//         return
//     }
// }

// const orderList = async (req: express.Request, res: express.Response) => {

//     const userId = parseInt(req.params.userId)

//     try {
//         // console.log(`in order handler, in orderList, user id: ${userId}`)
//         const orderList = await orderStore.orderList(userId)
//         res.json(orderList)
//         return
//     } catch (err) {
//         res.sendStatus(500)
//         // res.json(err)
//         return
//     }
// }

// const addProduct = async (req: express.Request, res: express.Response) => {

//     const orderItem: OrderItem = {
//         item_id: req.body.item_id,
//         order_id: req.body.order_id,
//         product_id: req.body.product_id,
//         quantity: req.body.quantity
//     }

//     console.log(JSON.stringify(orderItem, null, 4))

//     try {
//         const isActiveOrder = await orderStore.isActiveOrder(orderItem.order_id)
//         console.log(isActiveOrder)
//         if (isActiveOrder) {
//             const orderItemAdded = await orderStore.addProduct(orderItem)
//             res.json(orderItemAdded)
//             return
//         }
//         else {
//             res.sendStatus(403)
//             return
//         }
//         return
//     } catch (err) {
//         res.sendStatus(500)
//         res.json(err)
//         return
//     }

// }

// const orderRoutes = (app:express.Application) => {
//     app.post('/orders', create)
//     app.get('/orders/:userId/active', activeOrder)
//     app.get('/orders/:userId', orderList)
//     app.post('/orders/:userId/active', addProduct)
// }

// export default orderRoutes;
