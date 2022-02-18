import express from 'express';
// import type and class of model this handler file handles
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

// express handler function
const index = async (req: express.Request, res: express.Response) => {
  const products = await store.index();
    // res.json(products)
    res.send('Products index route')
};

// const show = async(req: express.Request, res: express.Response, id: number) => {
//     const product = await store.show(id)
//     res.send(`Products show route`)
// }

// to allow the handler above access to express method we create the function below,
// that takes in an instance of express application object as a parameter.
// The server.ts file will provide that when calls this function
const productRoutes = (app: express.Application) => {
  // we call express method, that match our routes and
  // call the RESTful route handler to create a response
  app.get('/product', index);
};

export default productRoutes;
