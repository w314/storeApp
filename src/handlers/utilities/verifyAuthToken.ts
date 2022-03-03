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
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    jsonwebtoken.verify(token, tokenSecret);
    next();
  } catch (err) {
    res.status(401);
    res.json('Access denied, invalid token');
  }
};

export default verifyAuthToken;
