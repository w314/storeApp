"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Product type and ProductStore class to products table
const product_1 = require("../../models/product");
// import DbSetup class  to preapre database
const dbSetup_1 = require("../utilities/dbSetup");
// import mock data set
const mockDataSet_1 = __importDefault(require("../utilities/mockDataSet"));
describe('Product Model', () => {
    const dbSetup = new dbSetup_1.DbSetup();
    const store = new product_1.ProductStore();
    const testProduct = {
        id: mockDataSet_1.default.products.length + 1,
        name: 'iron',
        price: 19.98,
        url: 'none',
        description: 'In case you need things flat.',
        category_id: 5,
    };
    const productToUpdate = 0;
    const updatedProduct = mockDataSet_1.default.products[productToUpdate];
    updatedProduct.price += 100;
    // const updatedProduct: Product = {
    //     id: mockDataSet.products[productToUpdate].id,
    //     name: mockDataSet.products[productToUpdate].name,
    //     price: mockDataSet.products[productToUpdate].price + 100,
    //     url: mockDataSet.products[productToUpdate].url,
    //     description: mockDataSet.products[productToUpdate].description,
    //     category_id: mockDataSet.products[productToUpdate].category_id
    // }
    beforeAll(async () => {
        // clear and repopulate database
        await dbSetup.setup();
    });
    // TEST index method
    it('has an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('can show a list of products', async () => {
        const result = await store.index();
        expect(result.length).toEqual(mockDataSet_1.default.products.length);
    });
    // TEST show method
    it('has a show method', async () => {
        expect(store.show).toBeDefined();
    });
    it('shows product', async () => {
        const productId = 2;
        const result = await store.show(productId);
        expect(result).toEqual(mockDataSet_1.default.products[productId - 1]);
    });
    // TEST create method
    it('has a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('can create new product', async () => {
        // add new product
        const result = await store.create(testProduct);
        expect(result).toEqual(testProduct);
    });
    // TEST update method
    it('has an update method', () => {
        expect(store.update).toBeDefined();
    });
    it('updates product', async () => {
        const result = await store.update(updatedProduct);
        expect(result).toEqual(updatedProduct);
    });
    // TEST delete method
    it('has a delete method', () => {
        expect(store.delete).toBeDefined;
    });
    // when testing delete method, we delete testProduct
    // as it is not used in any orders and won't cause problems with delete
    it('deletes product not used in any order', async () => {
        // delete product
        const result = await store.delete(testProduct);
        // expect deleted product to equal testProduct
        expect(result).toEqual(testProduct);
        // expect productList to contain one less product
        // and equal original number of products provided before starting to tes
        const productList = await store.index();
        expect(productList.length).toEqual(mockDataSet_1.default.products.length);
    });
});
