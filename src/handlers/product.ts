import express from 'express';
import { request } from 'http';
// import type and class of model this handler file handles
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

// express handler function
const index = async (_req: express.Request, res: express.Response) => {
  try {
    console.log(`request came in`);
    const products = await store.index();
    console.log(`Products:`)
    console.log(products)
    // res.send('Products index route');

    res.json(products)
    // res.send('Products index route');
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: express.Request, res: express.Response) => {
  try {
    // console.log(`SHOW request with url: ${req.url}`)
    const id = parseInt(req.params.id);
    // const product = await store.show(id)
    // res.json(product)
    res.send(`Product show route, id of requested product: ${id}`);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (_req: express.Request, res: express.Response) => {
  try {
    console.log(_req.body)
    const product = {
      id: 0,
      name: _req.body.name,
      price: _req.body.price
    }
    console.log(product)
    const productCreated = await store.create(product)
    res.json(productCreated);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    // console.log(`SHOW request with url: ${req.url}`)
    const id = parseInt(req.params.id);
    // const product = await store.show(id)
    // res.json(product)
    res.send(`Product UPDATE route, id of requested product: ${id}`);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: express.Request, res: express.Response) => {
  try {
    const id = parseInt(req.params.id);
    res.send(`Product DELETE route, id of requested product: ${id}`);
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
  app.post('/products', create);
  app.put('/products/:id', update);
  app.delete('/products/:id', destroy);
};

export default productRoutes;
