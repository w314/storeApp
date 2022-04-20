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
import { DbSetup } from '../utilities/dbSetup';

// initialize enviromental variables
dotenv.config();
const pepper = process.env.BCRYPT_PASSWORD;
const tokenSecret: string = process.env.TOKEN_SECRET as string


fdescribe('User Model', () => {

  const store = new UserStore();

  const testUser = {
    user_id: 0,
    username: 'potter',
    firstname: 'Harry',
    lastname: 'Potter',
    password_digest: 'patronus',
    user_type: 'regular'
  };

  const dbSetup = new DbSetup()

  beforeAll( async () => {
    // prepare database for testing
    await dbSetup.setup() 
  })


  it('has create method', () => {
    expect(store.create).toBeDefined;
  });

  it('can create user', async () => {
    
    const result = await store.create(testUser);
    // use bcrypt to test if hashed password in result is the hash of the password provided
    expect(
      bcrypt.compareSync(
        testUser.password_digest + pepper,
        result.password_digest
      )
    ).toBeTrue;
    expect(testUser.username).toEqual(result.username);
    expect(testUser.firstname).toEqual(result.firstname);
    expect(testUser.lastname).toEqual(result.lastname);
  });

  it('has authenticate method', () => {
    expect(store.authenticate).toBeDefined;
  });

  it('can authenticate valid user', async () => {
    const result = await store.authenticate(
      testUser.username,
      testUser.password_digest
    );
    // use bcrypt to test if hashed password in result is the hash of the password provided
    if (result) {
      // separate payload object from jwt token result
      const verifyObj: jsonwebtoken.JwtPayload  = jsonwebtoken.verify(result, tokenSecret) as jsonwebtoken.JwtPayload
      // expect user name returned in jwt token to match username
      expect(testUser.username).toEqual(verifyObj.username)
      // encrypted user password should be the same encrypted password provided by the jwt token
      expect(
        bcrypt.compareSync(
          testUser.password_digest + pepper,
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
    // get list of users
    const result = await store.index();
    // console.log(result)
    expect(result.length).toEqual(dbSetup.users.length + 1)
    expect(result[0].username).toEqual(dbSetup.users[0].username);
  });

  it('has show method', () => {
      expect(store.show).toBeDefined
  })

  it('shows requested user', async () => {
      const result = await store.show(dbSetup.users[1].user_id)
      expect(result.username).toEqual(dbSetup.users[1].username)
  })

})