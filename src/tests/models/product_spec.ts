// import class to test and the types used
import { Product, ProductStore } from '../../models/product'

const store = new ProductStore();
const product = {
    id: 1,
    name: 'bob',
    price: 9.99,
};
const newProductName = 'bobek';
const updatedProduct = {
    id: product.id,
    name: newProductName,
    price: product.price,
};
describe('Product Model', () => {
    it('has a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('can create new product', async () => {
        const result = await store.create(product);
        expect(result).toEqual(product);
    });
    it('has an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('can show a list of products', async () => {
        const result = await store.index();
        expect(result).toEqual([product]);
    });
    it('has an update method', () => {
        expect(store.update).toBeDefined();
    });
    it('updates product', async () => {
        const result = await store.update(updatedProduct);
        expect(result).toEqual(updatedProduct);
        const productList = await store.index();
        expect(productList).toEqual([updatedProduct]);
    });
    it('has a show method', async () => {
        expect(store.show).toBeDefined();
    });
    it('shows product', async () => {
        const result = await store.show(product.id);
        expect(result).toEqual(updatedProduct);
    });
    it('has a delete method', () => {
        expect(store.delete).toBeDefined;
    });
    it('deletes product', async () => {
        const result = await store.delete(product);
        expect(result).toEqual(product);
        const productList = await store.index();
        expect(productList).toEqual([]);
    });
});
