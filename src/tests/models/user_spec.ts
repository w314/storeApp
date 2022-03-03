// import model class to test and types used
import { User, UserStore } from '../../models/user';
// import bcrypt to encrypt passwords
import bcrypt from 'bcrypt';
// import dotenv to use enviromental variables
import dotenv from 'dotenv';

// initialize enviromental variables
dotenv.config();
const pepper = process.env.BCRYPT_PASSWORD;
const store = new UserStore();
const testUser1 = {
  id: 1,
  username: 'bob',
  firstname: 'bob',
  lastname: 'bobek',
  password_digest: 'secretPassword',
};
const testUser2 = {
    id: 2,
    username: 'testuser',
    firstname: 'test',
    lastname: 'user',
    password_digest: 'userPass'
}

// test suite
describe('User Model', () => {
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
      expect(
        bcrypt.compareSync(
          testUser1.password_digest + pepper,
          result.password_digest
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
  it('has index method', () => {
    expect(store.index).toBeDefined;
  });
  it('shows a list of users', async () => {
    // add second user to db
    await store.create(testUser2)
    // get list of users
    const result = await store.index();
    expect(result.length).toEqual(2)
    expect(result[1].username).toEqual(testUser2.username);
  });
  it('has show method', () => {
      expect(store.show).toBeDefined
  })
  it('shows requested user', async () => {
      const result = await store.show(testUser2.id)
    //   console.log(result)
      expect(result.username).toEqual(testUser2.username)
  })
});
