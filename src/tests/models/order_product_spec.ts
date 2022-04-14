import client from './../../database'
import { OrderProductStore } from '../../models/order_products'
import { User } from '../../models/user'
import { Product } from '../../models/product'
import { Category } from '../../models/category'

describe('Order_product Model', () => {
    
    const orderProductStore = new OrderProductStore()
    
    const testUser: User = {
        user_id: 1,
        username: 'BobBobek',
        firstname: 'Bob',
        lastname: 'Bobek',
        password_digest: 'bobSecret',
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

    beforeAll( async () => {
        const conn = await client.connect()
        // empty order_products table
        await conn.query(`TRUNCATE order_products RESTART IDENTITY CASCADE`)
        await conn.query(`TRUNCATE categories RESTART IDENTITY CASCADE`)
        await conn.query(`TRUNCATE orders RESTART IDENTITY CASCADE`)
        await conn.query(`TRUNCATE users RESTART IDENTITY CASCADE`)

        // add testUser
        await conn.query(`INSERT INTO users
            (username, firstname, lastname, password_digest, user_type)
            VALUES ($1, $2, $3, $4, $5)`,
            [testUser.username, testUser.firstname, testUser.lastname, testUser.password_digest, testUser.user_type])

        // add testCategory
        await conn.query(`INSERT INTO categories
            (category_name)
            VALUES ($1)`,
            [testCategory.category_name])

        // add testProduct
        await conn.query(`INSERT INTO products
            (name, category_id)
            VALUES ($1, $2)`,
            [testProduct.name, testProduct.category_id])

    })

    it('has create method', async () => {
        expect(orderProductStore.create).toBeDefined()
    })
})