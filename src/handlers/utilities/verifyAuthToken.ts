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
  console.log(`IN VERIFY AUTH TOKEN`)
  try {
    const authorizationHeader: string = req.headers.authorization as string;
    console.log(`HEADER: ${authorizationHeader}`)
    const token = authorizationHeader.slice(6);
    console.log(`TOKEN: ${token}`)
    const verifyObj = jsonwebtoken.verify(token, tokenSecret);
    console.log(`\nVERIFY OBJECT`)
    console.log(verifyObj)
    next();
  } catch (err) {
    console.log(`ERROR in VERIFY: ${err}`)
    res.status(401);
    res.json('Access denied, invalid token');
  }
};

export default verifyAuthToken;
