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



const orderRoutes = (app:express.Application) => {
    app.post('/orders', create)
}

export default orderRoutes;
