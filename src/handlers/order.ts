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
        const orderCreated = await orderStore.create(order.user_id)
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
        const orderList = await orderStore.orderList(userId)
        res.json(orderList)
    } catch (err) {
        res.send(500)
        res.json(err)
    }
}




const orderRoutes = (app:express.Application) => {
    app.post('/orders', create)
    app.get('/orders/:userId/active', activeOrder)
    app.get('orders/:userId', orderList)
}

export default orderRoutes;
