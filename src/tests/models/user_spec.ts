// // import model class to test and types used
import { User, UserStore } from '../../models/user';
// import bcrypt for password encryption
import bcrypt from 'bcrypt';
// import dotenv to use enviromental variables
import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
// import DbSetup class to setup database for testing
import { DbSetup } from '../utilities/dbSetup';
// import mock data set
import mockDataSet from '../utilities/mockDataSet';

// initialize enviromental variables
dotenv.config();
const { PEPPER, TOKEN_SECRET } = process.env;

describe('User Model', () => {
  const dbSetup = new DbSetup();
  const store = new UserStore();

  const testUser: User = {
    id: 0,
    username: 'potter',
    firstname: 'Harry',
    lastname: 'Potter',
    password: 'patronus',
    user_type: 'regular',
  };

  beforeAll(async () => {
    // prepare database for testing
    await dbSetup.setup();
  });

  /***  test index method  ***/

  it('has index method', () => {
    expect(store.index).toBeDefined;
  });

  it('shows a list of users', async () => {
    // get list of users
    const result = await store.index();
    // console.log(result)
    expect(result.length).toEqual(mockDataSet.users.length);
    expect(result[0].username).toEqual(mockDataSet.users[0].username);
  });

  /***  test show method  ***/

  it('has show method', () => {
    expect(store.show).toBeDefined;
  });

  it('shows requested user', async () => {
    const result = await store.show(mockDataSet.users[1].id);
    expect(result.username).toEqual(mockDataSet.users[1].username);
  });

  /***  test create method  ***/

  it('has create method', () => {
    expect(store.create).toBeDefined;
  });

  it('can create user', async () => {
    // insert testUser into users table and get back created user
    const createdUser = await store.create(testUser);

    // check that createdUser detials match provided testUser input

    // expect new user to receive the next available id
    const userId: number = mockDataSet.users.length + 1;
    expect(userId).toEqual(createdUser.id);
    // use bcrypt to compare passwords of returned created user and testUser
    expect(bcrypt.compareSync(testUser.password + PEPPER, createdUser.password))
      .toBeTrue;
    expect(testUser.username).toEqual(createdUser.username);
    expect(testUser.firstname).toEqual(createdUser.firstname);
    expect(testUser.lastname).toEqual(createdUser.lastname);
  });

  /***  test authenticate method  ***/

  it('has authenticate method', () => {
    expect(store.authenticate).toBeDefined;
  });

  it('can authenticate valid user', async () => {
    // authenticate valid user, expect a jwt token as a result
    const jwt = await store.authenticate(testUser.username, testUser.password);

    // use bcrypt to test if hashed password in result is the hash of the password provided
    if (jwt) {
      // separate payload object from jwt result (payload object contains user information)
      const verifyObj: jsonwebtoken.JwtPayload = jsonwebtoken.verify(
        jwt,
        TOKEN_SECRET as string
      ) as jsonwebtoken.JwtPayload;
      // expect user name returned in jwt token to match testUser's username
      expect(testUser.username).toEqual(verifyObj.username);
      // expect encrypted user password returned in jwt token match testUser's password when encrypted
      expect(bcrypt.compareSync(testUser.password + PEPPER, verifyObj.password))
        .toBeTrue;
    } else {
      fail('Could not validate user with valid username');
    }
  });

  it('returns null when authenticating invalid username', async () => {
    const result = await store.authenticate(
      'invalidUserName',
      'invalidPassword'
    );
    expect(result).toBeNull;
  });

  // it('throws error when using valid username but invalid password', async () => {
  //   // try authenticate with valid username but invalid password
  //   const result = await store.authenticate(
  //     testUser.username,
  //     'invalidPassword'
  //   );

  //   console.log(result)
  // })

  // it('throws error when using valid username but invalid password', (done) => {
  //     expect( () => {
  //       store.authenticate(testUser.username, 'invalidPassword')
  //       .then(done)
  //       .catch((err) => {
  //         err ? done.fail(err) : done()
  //       })
  //     })
  //   })
});
