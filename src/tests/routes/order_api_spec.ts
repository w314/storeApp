import { agent as request } from 'supertest'
import app from '../../server'
import { DbSetup } from '../utilities/dbSetup'



describe('Order API Testing', () => {

    const dbSetup = new DbSetup()

    beforeAll( async () => {
        // prepare database for testing
        await dbSetup.setup()

    })


    it('GET /orders/:userId/active returns active order of user', (done) => {
        request(app)
        .get(`/orders/${dbSetup.activeOrder.user_id}/active`)
        .expect(200)
        .then((result) => {
            expect(result.body.length).toEqual(dbSetup.numberOfItemsInActiveOrder)
            done()
        })
        .catch((err) => {
            done.fail(err)
        })
    })

    it('GET /orders/:userId returns list of completed order of user', (done) => {
        request(app)
        .get(`/orders/${dbSetup.user.user_id}`)
        .expect(200)
        .then((result) => {
            expect(result.body.length).toEqual(dbSetup.numberOfItemsInCompletedOrdersOfUser)
        })
    })
})