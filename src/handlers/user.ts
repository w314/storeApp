import express from 'express';
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
    password_digest: req.body.password
  }

  try {
    // create user
    await store.create(testUser);
    // create user token
    try {
      const token = await store.authenticate(testUser.username, testUser.password_digest)
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
  try {
    // get user provided by verifyAuthToken middleware
    const userInToken = res.locals.jwtObject
    
    // console.log(`USER IN TOKEN: ${JSON.stringify(userInToken, null, 4)}`)
    // const idInToken = res.locals.jwtObject.id
    // console.log(`ID in TOKEN: ${idInToken}`)

    // get user id from url
    const idInUrl = parseInt(req.params.id)
    // console.log(`ID in URL: ${idInUrl}`)
    // get user data from url

    // if user id in URL and in Token is the same return user 
    if (userInToken.id === idInUrl) {
      res.json({
          'username': userInToken.username,
          'firstname': userInToken.firstname,
          'lastname': userInToken.lastname,
          'password_digest': userInToken.password_digest
        })
    } else {
      // send 401 not authorized error
      res.status(401)
      res.send('Not authorized to view user')
    }
    // const user = await store.show(idInUrl)
    // console.log('SENDING RESPONSE')
    // console.log(user)
    // res.json(user)
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
