// import supertest from 'supertest'
import { OrderStore } from './../../models/order'
import client from './../../database'
import { Category } from '../../models/category'
import { Product } from '../../models/product'
import { User } from '../../models/user'

describe('Order Model', () => {

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
    
    const testProduct: Product = {
        product_id: 1,
        name: 'testProduct',
        price: 9.98,
        category_id: 1
    }

    const orderStore = new OrderStore()

    beforeAll( async () => {
        // prepare database for testing
        const conn = await client.connect()
        // empty tables in database
        await conn.query(`TRUNCATE order_items RESTART IDENTITY CASCADE`)
        await conn.query(`TRUNCATE categories RESTART IDENTITY CASCADE`)
        await conn.query(`TRUNCATE orders RESTART IDENTITY CASCADE;`)
        await conn.query(`TRUNCATE users RESTART IDENTITY CASCADE`)
  
        // add testUser
        await conn.query(`INSERT INTO users 
            (username, firstname, lastname, user_type)
            VALUES ($1, $2, $3, $4)`,
            [testUser.username, testUser.firstname, testUser.lastname, testUser.user_type])

        // add testCategory
        await conn.query(`INSERT INTO categories
            (category_name)
            VALUES ($1)`,
            [testCategory.category_name])

        // add testProduct
        await conn.query(`INSERT INTO products
            (name, price, category_id )
            VALUES ($1, $2, $3)`,
            [testProduct.name, testProduct.price, testProduct.category_id])

        conn.release()
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
        await orderStore.addProduct(1, testProduct.product_id, 3)
        const conn = await client.connect()
        const result = await conn.query(`SELECT * FROM order_items`)
        expect(result.rows.length).toEqual(1)
        expect(result.rows[0].quantity).toEqual(3)
    })
})