// import model class to test and types used
import { User, UserStore } from '../../models/user';
// import bcrypt to encrypt passwords
import bcrypt from 'bcrypt';
// import dotenv to use enviromental variables
import dotenv from 'dotenv';
import jsonwebtoken, { Jwt } from 'jsonwebtoken'
// import database client
import client from './../../database'
import dbCleaner from '../utilities/dbCleaner';

// initialize enviromental variables
dotenv.config();
const pepper = process.env.BCRYPT_PASSWORD;
const tokenSecret: string = process.env.TOKEN_SECRET as string
const store = new UserStore();
const testUser1 = {
  user_id: 1,
  username: 'bob',
  firstname: 'bob',
  lastname: 'bobek',
  password_digest: 'secretPassword',
  user_type: 'regular'
};
const testUser2 = {
    user_id: 2,
    username: 'testuser',
    firstname: 'test',
    lastname: 'user',
    password_digest: 'userPass',
    user_type: 'regular'
}

// test suite
describe('User Model', () => {

  beforeAll( async () => {
    // prepare database for testing

    // empty tables
    await dbCleaner()
  })


  it('has create method', () => {
    expect(store.create).toBeDefined;
  });
  it('can create user', async () => {
    const result = await store.create(testUser1);
    // console.log(result)
    // console.log(testUser1)
    // use bcrypt to test if hashed password in result is the hash of the password provided
    expect(
      bcrypt.compareSync(
        testUser1.password_digest + pepper,
        result.password_digest
      )
    ).toBeTrue;
    //
    expect(testUser1.username).toEqual(result.username);
    expect(testUser1.firstname).toEqual(result.firstname);
    expect(testUser1.lastname).toEqual(result.lastname);
  });
  it('has authenticate method', () => {
    expect(store.authenticate).toBeDefined;
  });
  it('can authenticate valid user', async () => {
    const result = await store.authenticate(
      testUser1.username,
      testUser1.password_digest
    );
    // use bcrypt to test if hashed password in result is the hash of the password provided
    if (result) {
      // separate payload object from jwt token result
      const verifyObj: jsonwebtoken.JwtPayload  = jsonwebtoken.verify(result, tokenSecret) as jsonwebtoken.JwtPayload
      // expect user name returned in jwt token to match username
      expect(testUser1.username).toEqual(verifyObj.username)
      // encrypted user password should be the same encrypted password provided by the jwt token
      expect(
        bcrypt.compareSync(
          testUser1.password_digest + pepper,
          verifyObj.password_digest
        )
      ).toBeTrue;
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
  // it('throws error when using valid username but invalid password', (done) => {
  //     expect( () => {
  //       store.authenticate(testUser1.username, 'invalidPassword')
  //       .then(done)
  //       .catch((err) => {
  //         err ? done.fail(err) : done()
  //       })
  //     })
  //   // }
  it('has index method', () => {
    expect(store.index).toBeDefined;
  });
  it('shows a list of users', async () => {
    // add second user to db
    await store.create(testUser2)
    // get list of users
    const result = await store.index();
    // console.log(result)
    expect(result.length).toEqual(2)
    expect(result[1].username).toEqual(testUser2.username);
  });
  it('has show method', () => {
      expect(store.show).toBeDefined
  })
  it('shows requested user', async () => {
    // console.log(JSON.stringify(testUser2, null, 4))
      const result = await store.show(testUser2.user_id)
        // console.log(result)
      expect(result.username).toEqual(testUser2.username)
  })
})