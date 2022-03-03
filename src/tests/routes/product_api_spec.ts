// import supertest to make http requests to server
import { agent as request } from 'supertest'
// import server to test its endpoints
import app from '../../server'
// import client to set up database for testing
import client from '../../database'
// import Product type
import { Product, ProductStore } from '../../models/product'


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
        it('gives list of products', (done) => {
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
    
    
})
