// import supertest to make http requests to server
import { agent as request } from 'supertest'
// import server to test its endpoints
import app from '../../server'
// import user model to sign in user for testing product creation
import { UserStore } from '../../models/user'
import { DbSetup } from '../utilities/dbSetup'


describe('Product API Testing', () => {

    const dbSetup = new DbSetup()
    let adminToken = ''
    let userToken = ''
    const testProduct = {product_id: dbSetup.products.length + 1, name: 'Scarf', price: 4.5, category_id: 3 }

    beforeAll( async () => {
        // setup database
        await dbSetup.setup()

        // add user to to use for product creation
        const userStore = new UserStore()
        userToken = await userStore.authenticate(dbSetup.user.username, dbSetup.user.password_digest) as string
    })


    it('POST /products creates product if JWT token is provided', (done) => {
        // console.log(testProducts[0])
        // console.log(userToken)

        request(app)
        .post('/products')
        .send(testProduct)
        .set('Authorization', 'Bearer' + userToken)
        .expect(200)
        .then((response) => {
            // console.log(`RESPONSE: ${response}`)
            // set correct id for created product
            // testProduct.product_id = response.body.product_id
            // created products name should match with name of testProduct
            // console.log(`TEST PRODUCT AFTER ID UPDATE: ${JSON.stringify(testProducts[0], null, 4)}`)
            expect(response.body.name).toEqual(testProduct.name)
            done()
        })
        .catch((err) => {
            console.log(err)
            done.fail(err)
        })
    })


    it('POST /products send 401 code if trying to create product without token', (done) => {
        request(app)
        .post('/products')
        .send(testProduct)
        .expect(401)
        .end((err) => {
            err ? done.fail(err) : done()
        })  
    })


    it('GET /products/id returns product with requested id', (done) => {
        // console.log(`TEST PRODUCT[0]: ${JSON.stringify(testProducts[0], null, 4)}`)
        const productId = 1
        request(app)
            .get(`/products/${productId}`)
            .expect(200)
            .then((response) => {
                // console.log(response)
                expect(response.body).toEqual(dbSetup.products[productId-1])
                done()
            })
            .catch((Error) => {
                Error ? done.fail(Error) : done()
            })
    })


    it('GET /products returns list of products', (done) => {
        request(app)
        .get('/products')
        .expect(200)
        .then((response) => {
            // console.log(response.body)
            expect(response.body.length).toEqual(dbSetup.products.length + 1)
            done()
        })
        .catch((err) => {
            err ? done.fail(err) : done()
        })
    })
})
