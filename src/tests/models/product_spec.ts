// // import class to test and the types used
// import { Product, ProductStore } from '../../models/product';
// // import category model to create categories in test database
// // import client to preapre database
// import { DbSetup } from '../utilities/dbSetup'

// xdescribe('Product Model', () => {

//   const dbSetup = new DbSetup()
//   const store = new ProductStore();

//   beforeAll( async () => {
//     // prepare database
//     await dbSetup.setup()
//    })
    
//   it('has a create method', () => {
//     expect(store.create).toBeDefined();
//   });

//   it('can create new product', async () => {
//     // add new product
//     const product: Product = {
//       product_id: dbSetup.products.length + 1,
//       name: 'bob',
//       price: 9.99,
//       category_id: 1
//     };  
//     const result = await store.create(product);
//     expect(result).toEqual(product);
//   });

//   it('has an index method', () => {
//     expect(store.index).toBeDefined();
//   });

//   it('can show a list of products', async () => {
//     const result = await store.index();
//     expect(result.length).toEqual(dbSetup.products.length + 1);
//   });

//   it('has an update method', () => {
//     expect(store.update).toBeDefined();
//   });

//   it('updates product', async () => {
//     // update first product with new name
//     const productId = 1
//     const newName = 'newName'
//     const updatedProduct: Product = {
//       product_id: productId,
//       name: 'newName',
//       price: dbSetup.products[productId-1].price,
//       category_id: dbSetup.products[productId-1].category_id
//     }
//     const result = await store.update(updatedProduct);
//     expect(result).toEqual(updatedProduct);
//   })

//   it('has a show method', async () => {
//     expect(store.show).toBeDefined();
//   });

//   it('shows product', async () => {
//     const productId = 2
//     const result = await store.show(productId);
//     expect(result).toEqual(dbSetup.products[productId-1]);
//   });



//   // // delet product doesn't work, because of foreign key on delete restrict
//   // it('has a delete method', () => {
//   //   expect(store.delete).toBeDefined;
//   // });
//   // it('deletes product', async () => {
//   //   const productId = 3
//   //   const result = await store.delete(dbSetup.products[productId-1]);
//   //   expect(result).toEqual(dbSetup.products[productId-1]);
//   //   const productList = await store.index();
//   //   expect(productList.length).toEqual(dbSetup.products.length);
//   // });
// });
