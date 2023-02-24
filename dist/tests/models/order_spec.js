"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // import supertest from 'supertest'
// import Order and OrderItem types and OrderStore class
const order_1 = require("./../../models/order");
// import database client
const database_1 = __importDefault(require("./../../database"));
// import DbSetup class to setup database before testing
const dbSetup_1 = require("../utilities/dbSetup");
// import mock data set
const mockDataSet_1 = __importDefault(require("../utilities/mockDataSet"));
describe('Order Model', () => {
    const dbSetup = new dbSetup_1.DbSetup();
    const orderStore = new order_1.OrderStore();
    const testOrder = {
        id: mockDataSet_1.default.orders.length + 1,
        user_id: mockDataSet_1.default.user.id,
        order_status: 'active',
    };
    const testOrderItem = {
        id: mockDataSet_1.default.orderItems.length + 1,
        order_id: mockDataSet_1.default.activeOrder.id,
        product_id: mockDataSet_1.default.products[0].id,
        quantity: 2,
    };
    beforeAll(async () => {
        // prepare database for testing
        await dbSetup.setup();
    });
    // TEST method to get list of a user's completed order
    it('has completedOrders method', () => {
        expect(orderStore.completedOrders).toBeDefined();
    });
    it('can show list of completed orders of user', async () => {
        // check for itesm in completed orders of mockDataSet.user
        const result = await orderStore.completedOrders(mockDataSet_1.default.user.id);
        expect(result.length).toEqual(mockDataSet_1.default.numberOfItemsInCompletedOrders);
    });
    // TEST method to get active order of user
    it('has activeOrder method', () => {
        expect(orderStore.activeOrder).toBeDefined();
    });
    it('can show active order of user', async () => {
        // test the active order created by userWithActiveOrder when setting up the database
        const activeOrder = await orderStore.activeOrder(mockDataSet_1.default.userWithActiveOrder.id);
        expect(activeOrder.length).toEqual(mockDataSet_1.default.numberOfItemsInActiveOrder);
    });
    it('has create method', () => {
        expect(orderStore.create).toBeDefined();
    });
    // TEST create order method
    it('can create order for user with no active order', async () => {
        // create order
        const createdOrder = await orderStore.create(testOrder);
        // check if returned order equals testOrder
        expect(createdOrder).toEqual(testOrder);
        // check if order was created
        // connect to database
        const conn = await database_1.default.connect();
        // get list of all order
        const orderList = await conn.query(`SELECT * FROM orders`);
        // disconnect from database
        conn.release();
        // there shoud be 1 more order than after running dbSetup
        expect(orderList.rows.length).toEqual(mockDataSet_1.default.orders.length + 1);
    });
    // TODO test new order for user with active order
    // TEST adding item to an order
    it('has addOrderItem method', () => {
        expect(orderStore.addOrderItem).toBeDefined();
    });
    it('can add new item to active order', async () => {
        // add new order_item to newly created order
        const createdOrderItem = await orderStore.addOrderItem(testOrderItem);
        // check if returned createdOrderItem equals to testOrderItem we wanted to create
        expect(createdOrderItem).toEqual(testOrderItem);
        // check if order_items table now has 1 more order_item in it
        // connect to database
        const conn = await database_1.default.connect();
        // get list of orderItems
        const result = await conn.query(`SELECT * FROM order_items`);
        // there should be one more order_itmes than at setup
        expect(result.rows.length).toEqual(mockDataSet_1.default.orderItems.length + 1);
    });
    // TODO test adding new item to completed order
    // TODO test adding item already existing in active
    //     // THIS DOES NOT WORK BELOW AND WHEN RUN GIVES ERROR MESSAGE EXPECTED HERE AT THE
    //     // 'can show active or of user' test
    //     // xit('throws error if trying to add new item to completed order', async () => {
    //     //     // try to add new item to a completed order
    //     //     // await orderStore.addProduct(mockDataSet.completedOrder.order_id, mockDataSet.products[1].product_id, 5)
    //     //     await expect(async function() {await orderStore.addProduct(mockDataSet.completedOrder.order_id, mockDataSet.products[1].product_id, 5)}).toThrow(new Error('Cannot add new item to completed order.'))
    //     //     // expect(async function() {await orderStore.addProduct(mockDataSet.completedOrder.order_id, mockDataSet.products[1].product_id, 5)}).toThrow()
    //     // })
});
