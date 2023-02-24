"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import supertest to make http requests to server
const supertest_1 = require("supertest");
// import server to test its endpoints
const server_1 = __importDefault(require("../../server"));
// import User type and UserStore class
const user_1 = require("../../models/user");
// import DbSetup class to set up database before testing
const dbSetup_1 = require("../utilities/dbSetup");
// import mock data set
const mockDataSet_1 = __importDefault(require("../utilities/mockDataSet"));
describe('Product API Testing', () => {
    const dbSetup = new dbSetup_1.DbSetup();
    // token for testing product creation
    let adminToken = '';
    let userToken = '';
    // product to test product entry
    const testProduct = {
        id: mockDataSet_1.default.products.length + 1,
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
        const userStore = new user_1.UserStore();
        adminToken = (await userStore.authenticate(mockDataSet_1.default.admin.username, mockDataSet_1.default.admin.password));
        userToken = (await userStore.authenticate(mockDataSet_1.default.user.username, mockDataSet_1.default.user.password));
    });
    // TEST GET /products
    it('GET /products returns list of products', (done) => {
        (0, supertest_1.agent)(server_1.default)
            .get('/products')
            .expect(200)
            .then((response) => {
            // console.log(response.body)
            expect(response.body.length).toEqual(mockDataSet_1.default.products.length);
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
        (0, supertest_1.agent)(server_1.default)
            .get(`/products/${productId}`)
            .expect(200)
            .then((response) => {
            // console.log(response)
            expect(response.body).toEqual(mockDataSet_1.default.products[productId - 1]);
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
        (0, supertest_1.agent)(server_1.default)
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
        (0, supertest_1.agent)(server_1.default)
            .post('/products')
            .send(testProduct)
            .set('Authorization', 'Bearer' + userToken)
            .expect(401)
            .end((err) => {
            err ? done.fail(err) : done();
        });
    });
});
