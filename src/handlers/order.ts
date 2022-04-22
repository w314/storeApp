import { Order, OrderStore } from './../models/order'
import express from 'express'


const orderStore = new OrderStore

const create = async (req:express.Request, res:express.Response) => {
    
    const order = {
        order_id: 0,
        user_id: parseInt(req.params.id),
        order_status: 'active'
    }
    
    try {
        const orderCreated = await orderStore.create(order)
        res.json(orderCreated)
    } catch (err) {
        res.status(500)
        res.json(err)
    }
}


const activeOrder = async (req: express.Request, res: express.Response) =>  {

    const userId = parseInt(req.params.userId)

    try {
        const activeOrder = await orderStore.activeOrder(userId)
        res.json(activeOrder)
    } catch (err) {
        res.send(500)
        res.json(err)
    }
}


const orderList = async (req: express.Request, res: express.Response) => {

    const userId = parseInt(req.params.userId)
   
    try {
        console.log(`in order handler, in orderList, user id: ${userId}`)
        const orderList = await orderStore.orderList(userId)
        res.json(orderList)
    } catch (err) {
        res.send(500)
        res.json(err)
    }
}


const addProduct = async (req: express.Request, res: express.Response) => {

    // const orderItem: OrderItem = {
    //     item_id: 
    //     userId: req.params.user_id
    // }
    // const userId = req.params.userId
    // const productId = req.params.productId
    // const quantity = req.body.quantity



}


const orderRoutes = (app:express.Application) => {
    app.post('/orders', create)
    app.get('/orders/:userId/active', activeOrder)
    app.get('/orders/:userId', orderList)
    app.get('/orders/:userId/active/:productId', addProduct)
}


export default orderRoutes;
