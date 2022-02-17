// import class to test and the types used
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

describe('Product Model', () => {
  it('has a create mehtod', () => {
    expect(store.create).toBeDefined();
  });
  it('can create new product', async () => {
    const product: Product = {
      id: 0,
      name: 'bob',
      price: 9.99,
    };
    const result: object = await store.create(product);

    expect(result).toEqual({
      id: 1,
      name: product.name,
      price: product.price,
    });
  });
  it('has an index method', () => {
    expect(store.index).toBeDefined();
  });
  it('has a create new product');
});
