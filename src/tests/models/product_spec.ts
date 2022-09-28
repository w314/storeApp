// import Product type and ProductStore class to products table
import { Product, ProductStore } from '../../models/product';
// import DbSetup class  to preapre database
import { DbSetup } from '../utilities/dbSetup';

describe('Product Model', () => {
  const dbSetup = new DbSetup();
  const store = new ProductStore();
  const testProduct: Product = {
    id: dbSetup.products.length + 1,
    name: 'iron',
    price: 19.98,
    url: 'none',
    description: 'In case you need things flat.',
    category_id: 5,
  };
  const productToUpdate = 0;
  const updatedProduct: Product = dbSetup.products[productToUpdate];
  updatedProduct.price += 100;
  // const updatedProduct: Product = {
  //     id: dbSetup.products[productToUpdate].id,
  //     name: dbSetup.products[productToUpdate].name,
  //     price: dbSetup.products[productToUpdate].price + 100,
  //     url: dbSetup.products[productToUpdate].url,
  //     description: dbSetup.products[productToUpdate].description,
  //     category_id: dbSetup.products[productToUpdate].category_id
  // }

  beforeAll(async () => {
    // clear and repopulate database
    await dbSetup.setup();
  });

  // TEST index method

  it('has an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('can show a list of products', async () => {
    const result = await store.index();
    expect(result.length).toEqual(dbSetup.products.length);
  });

  // TEST show method

  it('has a show method', async () => {
    expect(store.show).toBeDefined();
  });

  it('shows product', async () => {
    const productId = 2;
    const result = await store.show(productId);
    expect(result).toEqual(dbSetup.products[productId - 1]);
  });

  // TEST create method

  it('has a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('can create new product', async () => {
    // add new product
    const result = await store.create(testProduct);
    expect(result).toEqual(testProduct);
  });

  // TEST update method

  it('has an update method', () => {
    expect(store.update).toBeDefined();
  });

  it('updates product', async () => {
    const result = await store.update(updatedProduct);
    expect(result).toEqual(updatedProduct);
  });

  // TEST delete method

  it('has a delete method', () => {
    expect(store.delete).toBeDefined;
  });

  // when testing delete method, we delete testProduct
  // as it is not used in any orders and won't cause problems with delete
  it('deletes product not used in any order', async () => {
    // delete product
    const result = await store.delete(testProduct);
    // expect deleted product to equal testProduct
    expect(result).toEqual(testProduct);
    // expect productList to contain one less product
    // and equal original number of products provided before starting to tes
    const productList = await store.index();
    expect(productList.length).toEqual(dbSetup.products.length);
  });
});
