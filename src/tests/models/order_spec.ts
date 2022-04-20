// import supertest from 'supertest'
import { OrderStore } from './../../models/order'
import client from './../../database'
import { Category } from '../../models/category'
import { Product } from '../../models/product'
import { User } from '../../models/user'
import dbCleaner from '../utilities/dbCleaner'
import { DbSetup } from '../utilities/dbSetup'

fdescribe('Order Model', () => {

    const testUser: User = {
        user_id: 1,
        username: 'OrderTester',
        firstname: 'Order',
        lastname: 'Tester',
        password_digest: 'testPass',
        user_type: 'regular'
    }
    
    const testCategory: Category = {
        category_id: 1,
        category_name: 'testCategory'
    }
    
    const testProducts: Product[] = [
        { product_id: 1, name: 'testProduct1', price: 9.98, category_id: 1 },
        { product_id: 2, name: 'testProduct2', price: 7, category_id: 1 },
        { product_id: 3, name: 'testProduct3', price: 92.98, category_id: 1 }
    ]    

    const activeOrderId = 1;

    const dbSetup = new DbSetup()
    const orderStore = new OrderStore()

    beforeAll( async () => {
        // prepare database for testing
        await dbSetup.setup()

        // // empty tables in database
        // await dbCleaner()

        // const conn = await client.connect()
        // // add testUser
        // await conn.query(`INSERT INTO users 
        //     (username, firstname, lastname, password_digest, user_type)
        //     VALUES ($1, $2, $3, $4, $5)`,
        //     [testUser.username, testUser.firstname, testUser.lastname, testUser.password_digest, testUser.user_type])

        // // add testCategory
        // await conn.query(`INSERT INTO categories
        //     (category_name)
        //     VALUES ($1)`,
        //     [testCategory.category_name])

        // // add testProducts
        // for (let i = 0; i < testProducts.length; i++) {
        //     await conn.query(`INSERT INTO products
        //     (name, price, category_id )
        //     VALUES ($1, $2, $3)`,
        //     [testProducts[i].name, testProducts[i].price, testProducts[i].category_id])
        // }
        // conn.release()

        // // await dbSetup()
    })


    it('has create method', () => {
        expect(orderStore.create).toBeDefined()
    })

    it('can create order', async () => {
        // create order
        await orderStore.create(testUser.user_id)
        // check if order was created
        const conn = await client.connect()
        const result = await conn.query(`SELECT * FROM orders`)
        conn.release()
        expect(result.rows.length).toEqual(1)
        expect(result.rows[0].user_id).toEqual(testUser.user_id)
    })

    it('has addProduct method', () => {
        expect(orderStore.addProduct).toBeDefined()
    })

    it('can add product to order', async () => {
        // add first product to order
        const quantity = 3
        await orderStore.addProduct(activeOrderId, testProducts[0].product_id, quantity)
        const conn = await client.connect()
        const result = await conn.query(`SELECT * FROM order_items WHERE order_id = ${activeOrderId}`)
        expect(result.rows.length).toEqual(1)
        expect(result.rows[0].quantity).toEqual(quantity)
    })

    it('has activeOrder method', () => {
        expect(orderStore.activeOrder).toBeDefined()
    })

    it('can show active order of user', async () => {
        // add rest of products (all but the first added in 'can add product to order test') to active Order
        for (let i = 1; i < testProducts.length; i++) {
            await orderStore.addProduct(activeOrderId, testProducts[i].product_id, i+2)
        }
        const activeOrder = await orderStore.activeOrder(testUser.user_id)
        expect(activeOrder.length).toEqual(testProducts.length)
    })

    it('has orderList method', () => {
        expect(orderStore.orderList).toBeDefined()
    })

    it('can show list of past orders of user', async () => {
        // create past orders for testUser
        // using variable i as orderId
        const conn = await client.connect()
        const completedOrders = 3
        const startingIndex = 2
        for(let i = startingIndex; i < startingIndex + completedOrders; i++) {
            await orderStore.create(testUser.user_id)
            // update order_status to complete
            const sql = `UPDATE orders SET order_status = $1 WHERE order_id = $2`
             await conn.query(sql, ['completed', i])
            for (let j = 0; j < testProducts.length; j++) {
                await orderStore.addProduct(i, testProducts[j].product_id, i +j)
            }
        }
        conn.release()
        // test list of past order of user
        const result = await orderStore.orderList(testUser.user_id)
        expect(result.length).toEqual(completedOrders * testProducts.length)

    })
})