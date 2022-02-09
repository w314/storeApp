// import class to test and the types used
import { Product, ProductStore } from '../product'

const store = new ProductStore;

describe('Product Model', () => {
    it('should have and index method', () => {
        expect(store.index).toBeDefined();
    })
})