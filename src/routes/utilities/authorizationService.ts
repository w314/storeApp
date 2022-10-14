import express from 'express';
// import dotenv to use environmental variables
import dotenv from 'dotenv';
// import jwt to verify tokens
import * as jwt from 'jsonwebtoken';

export class Authenticate {
  private static verifyToken = (
    req: express.Request,
    res: express.Response
  ) => {
    // initialize environmental variables
    dotenv.config();
    const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

    // get token from request header
    // console.log('\n Request in authorization')
    // console.log(req.headers)
    const authorizationHeader = req.headers.authorization as string;
    // remove word "Bearer" from authorizationHeader string
    const token = authorizationHeader.slice(6);
    // console.log(`TOKEN received by authorization service: ${JSON.stringify(token, null, 4)}`)
    try {
      // verify user
      const user = jwt.verify(token, TOKEN_SECRET);
      // console.log(`USER in authentication ${JSON.stringify(user, null, 4)}`)
      // store user
      res.locals.user = user;
      return true;
    } catch (err) {
      return false;
    }
  };

  // this method can be called to authenticate users
  static verify(role: 'admin' | 'user' | 'self') {
    // the method will returns this function
    return async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      // if token is  invalid
      if (!this.verifyToken(req, res)) {
        console.log('Invalid token.');
        res.status(401);
        res.json('Invalid token');
        return;
        //     // return res.status(401).send({
        //     msg: 'Invalid token',
        //     });
      }

      // if role is admin but user is not admin
      if (role === 'admin' && res.locals.user.user_type != 'admin') {
        console.log('User has to be admin for this action');
        res.status(401);
        res.json('User has to be admin for this action');
        return;
      }

      // if role is self but user is not self OR admin
      // console.log(`checking if user is admin or self`)
      // console.log(`request parameters: ${JSON.stringify(req.params, null, 4)}`)
      // console.log(`user id: ${res.locals.user.id}, user in request: ${parseInt(req.params.userId)}`)
      // console.log(`user type: ${res.locals.user.user_type}`)
      if (
        role === 'self' &&
        !(
          res.locals.user.id === parseInt(req.params.userId) ||
          res.locals.user.user_type === 'admin'
        )
      ) {
        console.log('Users can only acces their own records.');
        res.status(401);
        res.json('Users can only acces their own records.');
        return;
      }

      // there was no problem in authentication, call next function
      return next();
    };
  }
}
