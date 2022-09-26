import dotenv from 'dotenv';
import { Pool } from 'pg';

// intializing the environment variables
dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV,
} = process.env;

// declare client
const client = new Pool(
  {
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT as string),
    database: ENV === "dev" ? POSTGRES_DB : POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  }
);
console.log(`CLIENT:\n ${JSON.stringify(client, null, 4)}`)
export default client;
