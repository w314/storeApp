import express from 'express';
import { request } from 'http';
// import type and class of model this handler file handles
import { Product, ProductStore } from '../models/product';
import verifyAuthToken from './utilities/verifyAuthToken';

const store = new ProductStore();

// express handler function
const index = async (_req: express.Request, res: express.Response) => {
  try {
    const products = await store.index();
    // console.log(`Products:`);
    // console.log(products);
    // res.send('Products index route');

    res.json(products);
    // res.send('Products index route');
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: express.Request, res: express.Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await store.show(id)
    res.json(product)
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: express.Request, res: express.Response) => {
  try {
    // console.log(_req.body);
    const product = {
      product_id: req.body.product_id,
      name: req.body.name,
      price: req.body.price,
      category_id: req.body.category_id
    };
    // console.log(`PRODUCT IN REQ:\n ${JSON.stringify(product, null, 4)}`)
    const productCreated = await store.create(product);
    // console.log(JSON.stringify(productCreated, null, 4))
    res.json(productCreated);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};


// to allow the handler above access to express method we create the function below,
// that takes in an instance of express application object as a parameter.
// The server.ts file will provide that when calls this function
const productRoutes = (app: express.Application) => {
  // we call express method, that match our routes and
  // call the RESTful route handler to create a response
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
};

export default productRoutes;
