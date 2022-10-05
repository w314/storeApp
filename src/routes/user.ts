// import express
import express from 'express';
// import User type and Userstore class
import { User, UserStore } from '../models/user';
// importing jwt for creating jwt tokens
import * as jwt from 'jsonwebtoken';
// import dotenv to access environmental variables
import dotenv from 'dotenv';
// import verify utilities to verify user token and access
import { Authenticate } from './utilities/authorizationService';

const store = new UserStore();
// initialize enrionmental variables
dotenv.config();
const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

// create creates new user and returns a Json Web Token
const create = async (req: express.Request, res: express.Response) => {
  const testUser: User = {
    id: 0,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    user_type: 'regular',
  };

  try {
    // create user
    const userCreated = await store.create(testUser);
    try {
      // create token for user
      const token = jwt.sign(userCreated, TOKEN_SECRET);
      // return token
      res.json(token);
    } catch (err) {
      res.status(500);
      res.json(err);
    }
  } catch (err) {
    res.sendStatus(400);
    res.json(err);
  }
};

// if valid token is provided returns list of users
const index = async (req: express.Request, res: express.Response) => {
  try {
    const users: User[] = await store.index();
    console.log(`users from database: ${JSON.stringify(users, null, 4)}`);
    res.status(200);
    res.json(users);
  } catch (err) {
    console.log(`error: ${err}`);
    res.sendStatus(400);
    res.json(err);
  }
};

// show requires a Json Web Token and displays the user data requested
const show = async (req: express.Request, res: express.Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    res.sendStatus(400);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.post('/users', create);
  app.get('/users', Authenticate.verify('admin'), index);
  app.get('/users/:id', Authenticate.verify('self'), show);
};

export default userRoutes;
