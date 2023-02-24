// import app to use in testing
import app from '../../server';
// import supertest to test http requests
import { agent as request } from 'supertest';
//import jwt to verify tokens
import * as jwt from 'jsonwebtoken';
// import dotenv to use environmental variables
import dotenv from 'dotenv';
// import User type and UserStore class
import { User, UserStore } from '../../models/user';
// import DbSetup class to setup database
import { DbSetup } from '../utilities/dbSetup';
// import mock data set
import mockDataSet from '../utilities/mockDataSet';

describe('USER API TESTING', () => {
  // get TOKEN_SECRET from enviromental variables
  dotenv.config();
  const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

  const dbSetup = new DbSetup();
  let adminToken = '';
  let userToken = '';

  beforeAll(async () => {
    // setup database for testing
    await dbSetup.setup();
    // get token for an admin and a regular user
    const userStore = new UserStore();
    adminToken = (await userStore.authenticate(
      mockDataSet.admin.username,
      mockDataSet.admin.password
    )) as string;
    userToken = (await userStore.authenticate(
      mockDataSet.user.username,
      mockDataSet.user.password
    )) as string;
  });

  // TEST POST /users

  it('POST /users - Creates user and returns Json Web Token', (done) => {
    // new user to add
    const newUser: User = {
      id: mockDataSet.users.length + 1,
      username: 'newUser',
      firstname: 'New',
      lastname: 'User',
      password: '1234',
      user_type: 'regular',
    };

    request(app)
      .post('/users')
      .send(newUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // token received
        const token = response.body;
        // console.log(`TOKEN RECEIVED:\n ${token}`);

        // get user details from token
        const userObject: jwt.JwtPayload = jwt.verify(
          token,
          TOKEN_SECRET
        ) as jwt.JwtPayload;

        // check username id token
        expect(userObject.id).toEqual(newUser.id);
        done();
      })
      .catch((Error) => {
        Error ? fail() : done();
        console.log(Error);
      });
  });

  // TEST GET /users

  it('GET /users - Returns list of users to admin user', (done) => {
    request(app)
      .get('/users')
      // send admin token
      .set('Authorization', 'Bearer' + adminToken)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(mockDataSet.users.length + 1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done.fail();
      });
  });

  it('GET /users - Returns 401 status code if requested by regular user', (done) => {
    request(app)
      .get('/users')
      .set('Authorization', 'Bearer' + userToken)
      .expect(401)
      .end((err) => {
        err ? done.fail(err) : done();
      });
  });

  // TEST GET/users/:id
  it('GET /users/userId - Lets user see its own details', (done) => {
    request(app)
      .get(`/users/${mockDataSet.user.id}`)
      // send token to endpoint
      .set('Authorization', 'Bearer' + userToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect((response.body.user_id = mockDataSet.user.id));
        done();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        done.fail();
      });
  });

  it("GET /users/userId - Refuses to show a user's info of other regular users", (done) => {
    request(app)
      // ask for details of newly created user
      .get(`/users/${mockDataSet.users.length + 1}`)
      // send token to endpoint use token of mockDataSet's regular user
      .set('Authorization', 'Bearer' + userToken)
      .expect(401)
      .end((err) => {
        err ? done.fail(err) : done();
      });
  });

  it("GET /users/id - Lets admin see any user's details", (done) => {
    // console.log(`ADMIN TOKEN: \n ${adminToken}`)
    request(app)
      // ask for details of mockDataSet's regular user
      .get(`/users/${mockDataSet.user.id}`)
      // send admin token
      .set('Authorization', 'Bearer' + adminToken)
      .expect(200)
      .then((response) => {
        expect(response.body.username).toEqual(mockDataSet.user.username);
        done();
      })
      .catch((err) => {
        done.fail(err);
      });
  });
});
