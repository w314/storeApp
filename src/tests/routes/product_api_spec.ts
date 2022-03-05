// import supertest to make http requests to server
import { agent as request } from 'supertest'
// import server to test its endpoints
import app from '../../server'
// import client to set up database for testing
import client from '../../database'
// import Product type
import { Product } from '../../models/product'
// import user model to sign in user for testing product creation
import { User, UserStore } from '../../models/user'

// using id 2 & 3 for products as product wiht id 1 was already created during 
// product model testing
const testProducts: Product[] = [
    {
        id: 2,
        name: 'testProduct1',
        price: 3.2
    },
    {   
        id: 3,
        name: 'testProduct2',
        price: 4.5
    }
]


const setupDatabase = async(products:Product[]) => {
    // connect to database
    const conn = await client.connect()
    // delete all rows from products table
    const sqlDeleteAll = `DELETE FROM products`
    await conn.query(sqlDeleteAll)
    // add test products to database
    for(let i = 0; i < products.length; i++) {
        const sql = `INSERT INTO products (name, price) VALUES ($1, $2)`
        conn.query(sql,[products[i].name, products[i].price])
    }
    // disconnect from database
    conn.release()
}


describe('Product API', () => {

    beforeAll(() => {
        setupDatabase(testProducts)
    })

    describe('GET/products', () => {
        it('shows list of products', (done) => {
            request(app)
                .get('/products')
                .expect(200)
                .then((response) => {
                    // console.log(response)
                    expect(response.body).toEqual(testProducts)
                    done()
                })
                .catch((Error) => {
                    Error ? done.fail(Error) : done()
                })
        })
    })
    describe('GET/products/id', () => {
        it('shows product with specific id', (done) => {
            request(app)
                .get('/products/2')
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(testProducts[0])
                    done()
                })
                .catch((Error) => {
                    Error ? done.fail(Error) : done()
                })
        })

    })
    xdescribe('POST /products', () => {
        it('creates product when jwt token is provided', async (done) => {
            // sign in user to get JWT token
            // const store = new UserStore()
            const user: User = {
                id: 0,
                username: 'bigbird',
                firstname: 'big',
                lastname: 'bird',
                password_digest: 'secretChirp'
            }
            let token = ''

            await request(app)
            .post('/users')
            .send(user)
            .then((Response) => {
                token = Response.text
            })

            console.log(`token:`)
            console.log(token)
            
            // product to create
            const product: Product = {
                id: 0,
                name: 'test',
                price: 11.3
            }

            request(app)
            .post('/products')
            .set('Authorization', `${token}`)
            .send(product)
            .expect(200)
            .then((Response) => {
                console.log('API response')
                console.log(Response)
            })


        })
    })    
})
