import { agent as request } from 'supertest'
import app from '../../server'
import dbCleaner from '../utilities/dbCleaner'

describe('Order API Testing', () => {

    beforeAll( () => {
        // prepare database for testing

        // empty tables
        dbCleaner()

    })
    it('GET /orders/:userId/active return active order of user', async () => {
        request(app)
        .get('/orders/1')
    })
})