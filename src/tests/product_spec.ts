// import class to test and the types used
import { Product, ProductStore } from '../models/product';

console.log('import done');
const store = new ProductStore();
console.log('store created');
describe('Product Model', () => {
  it('should have and index method', () => {
    expect(store.index).toBeDefined();
  });
});
