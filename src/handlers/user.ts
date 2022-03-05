import express from 'express';
// import type and model class
import { User, UserStore } from '../models/user';

const store = new UserStore();

const create = async (req: express.Request, res: express.Response) => {
  const user: User = {
    id: 0,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password_digest: req.body.password
  }

  try {
    // create user
    await store.create(user);
    // create user token
    try {
      const token = await store.authenticate(user.username, user.password_digest)
      console.log('Token:')
      console.log(token)
      res.json(token);
    } catch(err) {
      res.status(500)
      res.json(err)
    }
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.post('/users', create);
};

export default userRoutes;
