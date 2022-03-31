import express, { response } from 'express';
// import type and model class
import { User, UserStore } from '../models/user';
// import verifyAuthToken
import verifyAuthToken from './utilities/verifyAuthToken';

const store = new UserStore();

// create creates new user and returns a Json Web Token
const create = async (req: express.Request, res: express.Response) => {
  const testUser: User = {
    id: 0,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password_digest: req.body.password,
    user_type: 'regular'
  }

  try {
    // create user
    await store.create(testUser);
    // create user token
    try {
      const token = await store.authenticate(testUser.username, testUser.password_digest)
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
  try {
    // get user provided by verifyAuthToken middleware
    const userInToken = res.locals.jwtObject
    
    // get user id from url
    const idInUrl = parseInt(req.params.id)

    // if user id in URL and in Token is the same
    // return user info from token 
    if (userInToken.id === idInUrl) {
      res.json({
          'id': userInToken.id,
          'username': userInToken.username,
          'firstname': userInToken.firstname,
          'lastname': userInToken.lastname,
          'password_digest': userInToken.password_digest,
          'user_type': userInToken.user_type
      })
    } else if (userInToken.user_type === 'admin') {
    // if the token is from an admin
    // get user info from model and return it 
      const user = await store.show(idInUrl)
      res.json(user)
    } else {
      // in all other cases
      // send 401 not authorized error
      res.status(401)
      res.send('Not authorized to view user')
    }
  } catch(err) {
    res.status(400)
    res.json(err)
  }
}

// if valid token is provided returns list of users
const index = async (req: express.Request, res: express.Response) => {
  try {
    // use token object provided with verifyAuthToken middleware
    // to check user_type of user requesting users list
    const user_type = res.locals.jwtObject.user_type
    // console.log(JSON.stringify(res.locals.jwtObject, null, 4))
    // user_type is admin return user list
    if (user_type === 'admin') {
      // return user list
      const users = await store.index() 
      res.status(200)
      res.json(users)
    } else {
      // return status 401 if user_type is not admin
      res.status(401)
      res.json('Regular users are not allowed to see user list')
    }
  } catch(err) {
    res.status(400)
    res.json(err)
  }
}


const userRoutes = (app: express.Application) => {
  app.post('/users', create);
  app.get('/users/:id', verifyAuthToken, show)
  app.get('/users', verifyAuthToken, index)
};

export default userRoutes;
