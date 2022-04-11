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
// import category model to create categories for products
import { Category, CategoryStore } from '../../models/category'
// import userRoutes from '../../handlers/user'
// import productRoutes from '../../handlers/product'

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

    const testCategories: Category[] = [
        {category_id: 0, category_name: 'Books'},
        {category_id: 0, category_name: 'Clothing'},
        {category_id: 0, category_name: 'Electronics'},
        {category_id: 0, category_name: 'Appliances'},
        {category_id: 0, category_name: 'Other'},
        {category_id: 0, category_name: 'Garden & Outdoor'},
        {category_id: 0, category_name: 'Grocery'}
    ]

    const testProducts: Product[] = [
        { product_id: 0, name: 'Harry Potter', price: 3.2, category_id: 2 },
        { product_id: 0, name: 'Scarf', price: 4.5, category_id: 3 },
    ]


    beforeAll( async () => {
        // setup database
        // connect to database
        const conn = await client.connect()
        // clear user table
        await conn.query('TRUNCATE users')
        // clear products table
        await conn.query('TRUNCATE products')
        // clear categories table
        await conn.query('TRUNCATE categories CASCADE')
        // disconnect from database
        conn.release()

        // add user to to use for product creation
        const userStore = new UserStore()
        await userStore.create(user)
        // get token for user
        userToken = await userStore.authenticate(user.username, user.password_digest) as string

        // add categories to category table to use for products
        const categoryStore = new CategoryStore()
        for (let i = 0; i < testCategories.length; i++) {
            // console.log(`ABOUT TO CREATE CATEGORY: ${testCategories[i].category_name}`)
            let categoryCreated = await categoryStore.create(testCategories[i].category_name)
            // update testCategories with id
            // console.log(`CATEGORY CREATED:\n ${JSON.stringify(categoryCreated, null, 4)}`)
            testCategories[i].category_id = categoryCreated.category_id
        }

        // add products to product table except first one
        const productStore = new ProductStore()
        for (let i = 1; i < testProducts.length; i++) {
            await productStore.create(testProducts[i])    
        }
    })
    it('POST /products creates product if JWT token is provided', (done) => {
        // console.log(testProducts[0])
        // console.log(userToken)
        request(app)
        .post('/products')
        .send(testProducts[0])
        .set('Authorization', 'Bearer' + userToken)
        .expect(200)
        .then((response) => {
            // console.log(`RESPONSE: ${response}`)
            // set correct id for created product
            testProducts[0].product_id = response.body.product_id
            // created products name should match with name of testProduct
            // console.log(`TEST PRODUCT AFTER ID UPDATE: ${JSON.stringify(testProducts[0], null, 4)}`)
            expect(response.body.name).toEqual(testProducts[0].name)
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
        .send(testProducts[1])
        .expect(401)
        .end((err) => {
            err ? done.fail(err) : done()
        })  
    })
    it('GET /products/id returns product with requested id', (done) => {
        // console.log(`TEST PRODUCT[0]: ${JSON.stringify(testProducts[0], null, 4)}`)
        request(app)
            .get(`/products/${testProducts[0].product_id}`)
            .expect(200)
            .then((response) => {
                // console.log(response)
                expect(response.body).toEqual(testProducts[0])
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
            expect(response.body.length).toEqual(testProducts.length)
            expect(response.body[response.body.length-1].price).toEqual(testProducts[0].price)
            done()
        })
        .catch((err) => {
            err ? done.fail(err) : done()
        })
    })
})
