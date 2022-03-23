import express from 'express';
// import type and model class
import { User, UserStore } from '../models/user';
// import verifyAuthToken
import verifyAuthToken from './utilities/verifyAuthToken';

const store = new UserStore();

// create creates new user and returns a Json Web Token
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
      // console.log('Token:')
      // console.log(token)
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

// show requires a Json Web Token and displays the user data requested
const show = async (req: express.Request, res: express.Response) => {
  console.log(`IN USER HANDLER SHOW`)
  try {
    // get user id from url
    const id = parseInt(req.params.id)
    console.log(`ID is: ${id}`)
    // get user data from url
    const user = await store.show(id)
    console.log('SENDING RESPONSE')
    console.log(user)
    res.json(user)
  } catch(err) {
    res.status(400)
    res.json(err)
  }
}

const userRoutes = (app: express.Application) => {
  app.post('/users', create);
  app.get('/users/:id', verifyAuthToken, show)
  // app.get('/users/:id', show)
};

export default userRoutes;
