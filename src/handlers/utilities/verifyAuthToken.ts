import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express';
import { verify } from 'crypto';

// intialize enviromentel variables
dotenv.config();
const tokenSecret: string = process.env.TOKEN_SECRET as string;

const verifyAuthToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // get token from authoraziation header
    const authorizationHeader: string = req.headers.authorization as string;
    // remove word "Bearer" from authorizationHeader string
    const token = authorizationHeader.slice(6);
    // verify token and store its content    
    const verifyObject = jsonwebtoken.verify(token, tokenSecret);
    // to store object of jwt to be available for use in any next middleware
    // or the route handler set res.locals.<variable name>
    res.locals.jwtObject = verifyObject
    next();
  } catch (err) {
    console.log(`ERROR in VERIFY: ${err}`)
    res.status(401);
    res.json('Access denied, invalid token');
  }
};

export default verifyAuthToken;
