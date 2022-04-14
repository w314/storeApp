// import supertest from 'supertest'
import { OrderStore } from './../../models/order'
import client from './../../database'

const testUser = {
    user_id: 1,
    username: 'OrderTester',
    firstname: 'Order',
    lastname: 'Tester',
    user_type: 'regular'
}

const orderStore = new OrderStore()

describe('Order Model', () => {

    beforeAll( async () => {
        // prepare database for testing
        const conn = await client.connect()
        // empty tables in database
        await conn.query(`TRUNCATE orders CASCADE;`)
        await conn.query(`TRUNCATE users CASCADE`)
        // add user to users table
        await conn.query(`INSERT INTO users 
            (username, firstname, lastname, user_type)
            VALUES ($1, $2, $3, $4)`,
            [testUser.username, testUser.firstname, testUser.lastname, testUser.user_type])
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
        expect(result.rows.length).toEqual(1)
        expect(result.rows[0].user_id).toEqual(testUser.user_id)
    })
})