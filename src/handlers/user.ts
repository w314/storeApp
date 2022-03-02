import express from 'express';
// import type and model class
import { User, UserStore } from '../models/user';

const store = new UserStore();

const create = async (_req: express.Request, res: express.Response) => {
  // const user = {
  //     username : _req.body.username,
  //     password : _req.body.password
  // }

  const testUser = {
    id: 1,
    username: 'bob',
    firstname: 'bob',
    lastname: 'bobek',
    password_digest: 'pass123',
  };
  try {
    const token = await store.create(testUser);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.post('/users', create);
};

export default userRoutes;
