import express from 'express';
// import type and class of model this handler file handles
import { Product, ProductStore } from '../models/product';
// import authorizationService for authentication
import { Authenticate } from './utilities/authorizationService';

const store = new ProductStore();

// INDEX return list of all products
const index = async (_req: express.Request, res: express.Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
    // res.json(err);
  }
};

// SHOW return a specific product
const show = async (req: express.Request, res: express.Response) => {
  try {
    // get product id from url
    const id = parseInt(req.params.productId);
    // get product from database
    const product = await store.show(id);
    // return product
    res.json(product);
  } catch (err) {
    res.sendStatus(500);
    res.json(err);
  }
};

// CREATE creates a new product
const create = async (req: express.Request, res: express.Response) => {
  try {
    const product: Product = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      url: req.body.url,
      description: req.body.description,
      category_id: req.body.category_id,
    };
    // console.log(`PRODUCT IN REQ:\n ${JSON.stringify(product, null, 4)}`)
    const productCreated = await store.create(product);
    // console.log(JSON.stringify(productCreated, null, 4))
    res.json(productCreated);
  } catch (err) {
    res.sendStatus(400);
    res.json(err);
  }
};

// to allow the routes above access to express method we create the function below,
// that takes in an instance of express application object as a parameter.
// The server.ts file will provide that when calls this function
const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:productId', show);
  app.post('/products', Authenticate.verify('admin'), create);
};

export default productRoutes;
