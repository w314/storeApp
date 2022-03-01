// import model class to test and types used
// import { blob } from 'stream/consumers';
import { User, UserStore } from '../models/user';
// import bcrypt to encrypt passwords
import bcrypt from 'bcrypt'
// import dotenv to use enviromental variables
import dotenv from 'dotenv'

// initialize enviromental variables
dotenv.config()
const pepper: string = process.env.BCRYPT_PASSWORD as string

const store = new UserStore();
const testUser: User = {
  id: 1,
  username: 'bob',
  firstname: 'bob',
  lastname: 'bobek',
  password_digest: 'secretPassword',
};

// test suite
describe('User Model', () => {
  it('has create method', () => {
    expect(store.create).toBeDefined;
  });
  it('can create user', async () => {
      const result = await store.create(testUser)
      // console.log(result)
      // console.log(testUser)
      // use bcrypt to test if hashed password in result is the hash of the password provided
      expect(bcrypt.compareSync(testUser.password_digest+pepper, result.password_digest)).toBeTrue
      // 
      expect(testUser.username).toEqual(result.username)
      expect(testUser.firstname).toEqual(result.firstname)
      expect(testUser.lastname).toEqual(result.lastname)
  })
  it('can authenticate valid user', async () => {
    const result: User | null = await store.authenticate(testUser.username, testUser.password_digest)
  // use bcrypt to test if hashed password in result is the hash of the password provided
    if(result) {
      expect(bcrypt.compareSync(testUser.password_digest+pepper, result.password_digest)).toBeTrue
    } else {
      fail('Could not validate user with valid username')
    }
  })   
  it('returns null when authenticating invalid username', async () => {
    const result = await store.authenticate('invalidUserName', 'invalidPassword')
    expect(result).toBeNull
  })
});
