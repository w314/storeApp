// import supertest to make http requests to server
import { agent as request } from 'supertest';
// import server to test its endpoints
import app from '../../server';
// import product type and ProductStore class
import { Product } from '../../models/product';
// import User type and UserStore class
import { UserStore } from '../../models/user';
// import DbSetup class to set up database before testing
import { DbSetup } from '../utilities/dbSetup';

describe('Product API Testing', () => {
  const dbSetup = new DbSetup();
  // token for testing product creation
  let adminToken = '';
  let userToken = '';
  // product to test product entry
  const testProduct: Product = {
    id: dbSetup.products.length + 1,
    name: 'Scarf',
    price: 4.5,
    url: '',
    description: '',
    category_id: 3,
  };

  beforeAll(async () => {
    // setup database
    await dbSetup.setup();
    // get user to to use for product creation
    const userStore = new UserStore();
    adminToken = (await userStore.authenticate(
      dbSetup.admin.username,
      dbSetup.admin.password
    )) as string;
    userToken = (await userStore.authenticate(
      dbSetup.user.username,
      dbSetup.user.password
    )) as string;
  });

  // TEST GET /products

  it('GET /products returns list of products', (done) => {
    request(app)
      .get('/products')
      .expect(200)
      .then((response) => {
        // console.log(response.body)
        expect(response.body.length).toEqual(dbSetup.products.length);
        done();
      })
      .catch((err) => {
        err ? done.fail(err) : done();
      });
  });

  // TEST GET /products/id

  it('GET /products/id returns product with requested id', (done) => {
    // console.log(`TEST PRODUCT[0]: ${JSON.stringify(testProducts[0], null, 4)}`)
    const productId = 3;
    request(app)
      .get(`/products/${productId}`)
      .expect(200)
      .then((response) => {
        // console.log(response)
        expect(response.body).toEqual(dbSetup.products[productId - 1]);
        done();
      })
      .catch((Error) => {
        Error ? done.fail(Error) : done();
      });
  });

  // TEST POST /products

  it('POST /products admin can create product', (done) => {
    // console.log(testProducts[0])
    // console.log(userToken)

    request(app)
      .post('/products')
      .send(testProduct)
      .set('Authorization', 'Bearer' + adminToken)
      .expect(200)
      .then((response) => {
        // console.log(`RESPONSE: ${response}`)
        // set correct id for created product
        // testProduct.product_id = response.body.product_id
        // created products name should match with name of testProduct
        // console.log(`TEST PRODUCT AFTER ID UPDATE: ${JSON.stringify(testProducts[0], null, 4)}`)
        expect(response.body.name).toEqual(testProduct.name);
        done();
      })
      .catch((err) => {
        console.log(err);
        done.fail(err);
      });
  });

  it('POST /products regular user cannot create product', (done) => {
    request(app)
      .post('/products')
      .send(testProduct)
      .set('Authorization', 'Bearer' + userToken)
      .expect(401)
      .end((err) => {
        err ? done.fail(err) : done();
      });
  });
});
