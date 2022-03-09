import dotenv from 'dotenv';
import { Pool } from 'pg';

// intializing the environment variables
dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV,
} = process.env;

// declare client
const client = new Pool(
  {
    host: POSTGRES_HOST,
    database: ENV === "dev" ? POSTGRES_DB : POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  }
);

export default client;
