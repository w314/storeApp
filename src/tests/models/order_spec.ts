// import supertest from 'supertest'
import { Order, OrderStore } from './../../models/order'
import client from './../../database'
import { DbSetup } from '../utilities/dbSetup'

fdescribe('Order Model', () => {

    const dbSetup = new DbSetup()
    const orderStore = new OrderStore()

    const newOrder: Order = {
        order_id: dbSetup.orders.length + 1,
        user_id: dbSetup.users[1].user_id,
        order_status: 'active'
    } 

    beforeAll( async () => {
        // prepare database for testing
        await dbSetup.setup()
    })


    it('has create method', () => {
        expect(orderStore.create).toBeDefined()
    })

    it('can create order', async () => {
        // create order
        await orderStore.create(newOrder.user_id)
        // check if order was created
        const conn = await client.connect()
        const result = await conn.query(`SELECT * FROM orders`)
        conn.release()
        // there shoud be 1 more order
        expect(result.rows.length).toEqual(dbSetup.orders.length + 1)
    })

    it('has addProduct method', () => {
        expect(orderStore.addProduct).toBeDefined()
    })

    it('can add product to active order', async () => {
        // add new order_item to first order
        const quantity = 3
        await orderStore.addProduct(newOrder.order_id, dbSetup.products[0].product_id, quantity)
        const conn = await client.connect()
        const result = await conn.query(`SELECT * FROM order_items`)
        // there should be one more order_itmes
        expect(result.rows.length).toEqual(dbSetup.orderItems.length + 1)
    })

    it('has activeOrder method', () => {
        expect(orderStore.activeOrder).toBeDefined()
    })

    it('can show active order of user', async () => {
        const activeOrder = await orderStore.activeOrder(newOrder.user_id)
        expect(activeOrder.length).toEqual(1)
    })

    it('has orderList method', () => {
        expect(orderStore.orderList).toBeDefined()
    })

    it('can show list of past orders of user', async () => {
        const result = await orderStore.orderList(dbSetup.users[0].user_id)
        expect(result.length).toEqual(dbSetup.firstUserCompletedOrders)
    })
})