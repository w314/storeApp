import { agent as request } from 'supertest';
import app from '../../server';
import { DbSetup } from '../utilities/dbSetup';
// import { OrderItem } from '../../models/order'
// import client from '../../database'
// import TestTokens class to create tokens for testing
// import User type and UserStore class
import { UserStore } from '../../models/user';
// import mock data set
import mockDataSet from '../utilities/mockDataSet';

const dbSetup = new DbSetup();
const userStore = new UserStore();
//  token for testing product creation
let adminToken = '';
let userToken = '';
let userWithActiveOrderToken = '';

describe('Order API Testing', () => {
  beforeAll(async () => {
    // prepare database for testing
    await dbSetup.setup();
    // console.log(`TEST DATABASE IS READY`)
    adminToken = (await userStore.authenticate(
      mockDataSet.admin.username,
      mockDataSet.admin.password
    )) as string;
    userToken = (await userStore.authenticate(
      mockDataSet.user.username,
      mockDataSet.user.password
    )) as string;
    userWithActiveOrderToken = (await userStore.authenticate(
      mockDataSet.userWithActiveOrder.username,
      mockDataSet.userWithActiveOrder.password
    )) as string;
  });

  // TEST GET/orders/:userId/active

  it('GET /orders/:userId/active User can see its own active order', (done) => {
    request(app)
      .get(`/orders/${mockDataSet.userWithActiveOrder.id}/active`)
      .set('Authorization', 'Bearer' + userWithActiveOrderToken)
      .expect(200)
      .end((err) => {
        err ? done.fail(err) : done();
      });
  });

  it("GET /orders/:userId/active admin can see any user's active order", (done) => {
    request(app)
      .get(`/orders/${mockDataSet.activeOrder.user_id}/active`)
      // .set('Authorization', 'Bearer' + userWithActiveOrderToken)
      .set('Authorization', 'Bearer' + adminToken)
      .expect(200)
      .then((result) => {
        expect(result.body.length).toEqual(mockDataSet.numberOfItemsInActiveOrder);
        done();
      })
      .catch((err) => {
        console.log(err);
        done.fail(err);
      });
  });

  it("GET orders/:userId/active Regular user cannot see other users' active order", (done) => {
    request(app)
      .get(`/orders/${mockDataSet.userWithActiveOrder.id}/active`)
      .set('Authorization', 'Bearer' + userToken)
      .expect(401)
      .end((err) => {
        err ? done.fail(err) : done();
      });
  });

  //     it('GET /orders/:userId returns list of completed orders of user', (done) => {
  //         request(app)
  //         .get(`/orders/${mockDataSet.user.user_id}`)
  //         .expect(200)
  //         .then((result) => {
  //             expect(result.body.length).toEqual(mockDataSet.numberOfItemsInCompletedOrdersOfUser)
  //             done()
  //         })
  //         .catch((err) => {
  //             done.fail(err)
  //         })
  //     })

  //     fit('POST /orders/:userId/active adds new product item to active order', (done) => {

  //         const activeOrder = mockDataSet.activeOrder
  //         const userId = mockDataSet.activeOrder.user_id

  //         const orderItem: OrderItem = {
  //             item_id: 0,
  //             order_id: activeOrder.order_id,
  //             product_id: mockDataSet.products[0].product_id,
  //             quantity: 37
  //         }

  //         console.log(JSON.stringify(orderItem, null, 4))

  //         request(app)
  //         .post(`/orders/${userId}/active`)
  //         .send(orderItem)
  //         .expect(200)
  //         .then((response) => {
  //         //     // console.log(`result: ${JSON.stringify(result, null, 4)}_ null, 4)}`)
  //         //     // console.log(`result.req: ${JSON.stringify(response.req.body, null, 4)}`)
  //             expect(response.body.quantity).toEqual(orderItem.quantity)
  //         //     // check that activeOrder has 1 more item
  //         //     // const itemsCheck = async () => {
  //         //     //     try {

  //         //     //         const conn =  await client.connect()
  //         //     //         const sql = `SELECT * FROM order_items WHERE order_id = $1`
  //         //     //         const result = await conn.query(sql, [activeOrder.order_id])
  //         //     //         // console.log(result)
  //         //     //         const activeOrderItems = result.rows
  //         //     //         console.log(activeOrderItems.length)
  //         //     //         console.log(mockDataSet.numberOfItemsInActiveOrder + 1)
  //         //     //         conn.release()
  //         //     //         expect(activeOrderItems.length).toEqual(mockDataSet.numberOfItemsInActiveOrder +  1)
  //         //     //         done()
  //         //     //     } catch (err) {
  //         //     //         throw new Error (`Could not check items in the active order. Error: ${err}`)
  //         //     //     }

  //         //     // }
  //         //     // itemsCheck()
  //             done()
  //         })
  //         .catch((err) => {
  //             console.log(err)
  //             done.fail(err)
  //         })
  //     })
});
