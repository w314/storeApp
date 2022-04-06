// import supertest to make http requests to server
import { agent as request } from 'supertest'
// import server to test its endpoints
import app from '../../server'
// import client to set up database for testing
import client from '../../database'
// import Product type
import { Product, ProductStore } from '../../models/product'
// import user model to sign in user for testing product creation
import { User, UserStore } from '../../models/user'
import userRoutes from '../../handlers/user'
import productRoutes from '../../handlers/product'

describe('Product API Testing', () => {

    const user = {
        id: 0,
        username: 'testuser',
        firstname: 'test',
        lastname: 'user',
        password_digest: 'userPass',
        user_type: 'regular'
    }

    let userToken = ''

    const testProducts: Product[] = [
    {
        product_id: 0,
        name: 'testProduct1',
        price: 3.2,
        category_id: 0
    },
    {   
        product_id: 0,
        name: 'testProduct2',
        price: 4.5,
        category_id: 0
    }
]



    beforeAll( async () => {
        // setup database
    
        // clean user and product tables
        const conn = await client.connect()
        const sqlCleanUserTable = 'DELETE FROM users'
        await conn.query(sqlCleanUserTable)
        const sqlCleanProductTable = 'DELETE FROM products'
        await conn.query(sqlCleanProductTable)
        conn.release()

        // add user to to use for product creation
        const userStore = new UserStore()
        await userStore.create(user)
        // get token for user
        userToken = await userStore.authenticate(user.username, user.password_digest) as string

        // add first product to product table
        const productStore = new ProductStore()
        await productStore.create(testProducts[0])
    })
    it('POST /products creates product if JWT token is provided', (done) => {
        request(app)
        .post('/products')
        .send(testProducts[1])
        .set('Authorization', 'Bearer' + userToken)
        .expect(200)
        .then((response) => {
            // set correct id for created product
            testProducts[1].product_id = response.body.id
            // created products name should match with name of testProduct
            expect(response.body.name).toEqual(testProducts[1].name)
            done()
        })
        .catch((err) => {
            done.fail(err)
        })
    })
    it('POST /products send 401 code if trying to create product without token', (done) => {
        request(app)
        .post('/products')
        .send(testProducts[1])
        .expect(401)
        .end((err) => {
            err ? done.fail(err) : done()
        })  
    })
    it('GET /products/id returns product with requested id', (done) => {
        request(app)
            .get(`/products/${testProducts[1].product_id}`)
            .expect(200)
            .then((response) => {
                // console.log(response)
                expect(response.body).toEqual(testProducts[1
                ])
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
            expect(response.body.length).toEqual(2)
            expect(response.body[1].price).toEqual(testProducts[1].price)
            done()
        })
        .catch((err) => {
            err ? done.fail(err) : done()
        })
    })
})
