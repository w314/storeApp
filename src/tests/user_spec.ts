// import model class to test and types used
import { blob } from 'stream/consumers';
import { User, UserStore } from '../models/user';

const store = new UserStore();
const testUser: User = {
  id: 1,
  userName: 'bob123',
  firstName: 'bob',
  lastName: 'bobek',
  password_digest: 'secretPassword',
};

// test suite
describe('User Model', () => {
  it('has create method', () => {
    expect(store.create).toBeDefined;
  });
  // it('can create user', () => {
  //     store.create(testUser)

  // })
});
