# Store App Tutorial - Backend
>Step by step instructions to create database facing side of the application

Work Flow
- Create Migrations
- Create Models
- Create Tests for Models
- Create Handlers
<br>Each model file will have its handler file. This file will have all the handler functions associated with the REST-ful routes regarding that model.
- Import handlers to server file


## Products

### Product Migrations
1. Create migration file
```bash
db-migrate create products-table --sql-file
```
- it will create the directory `migrations`
- a generated file that should not be modified
- an `sqls` directory with two files for the up and down migrations

2. Add up migration sql:
```sql
CREATE TABLE products (name VARCHAR(100), price float, id SERIAL PRIMARY KEY);
```

3. App down migration sql:
```sql
DROP TABLE products;
```


4. Run migrations
```bash
db-migrate up
```

### Product Models
`Models` will support `CRUD` actions on the tables created during `migration`. 

1. Create model directory
```bash
mkdir src/models
```
2. Create file for models for our products table

```bash
touch product.ts
```
Add Content:
```typescript
// import database connection
import client from '../database'

// creating a TypeScipt type for our table items
export type Product = {
    id : number;
    name : string;
    price: number;
}

/*
 a table in the database can be represended as a class
 CRUD actions are created as methods of the class
*/
export class ProductStore {
  //index() returns a list of all table items
  async index(): Promise<Product[]>{
    try {
      // open connection to db
      const conn = await client.connect();
      // sql command we want to execute
      const sql = 'SELECT * FROM products';
      // run query on database
      const result = await conn.query(sql);
      // close database connection
      conn.release();
      // return query result
      return result.rows;
    } catch(err) {
      throw new Error(`Cannot get products: ${err}`);
    }
    
  }
}
```
### Product Model Testing

Write tests in `product_spec.ts`:
```typescript
// import class to test and the types used
import { Product, ProductStore } from '../models/product';

console.log('import done');
const store = new ProductStore();
console.log('store created');
describe('Product Model', () => {
  it('should have and index method', () => {
    expect(store.index).toBeDefined();
  });
});
```

6. Run tests
```bash
npm run test
```

### Product Handlers


```typescript
import express from 'express'
// import type and class of model this handler file handles
import { Product, ProductStore } from '../models/product'

const store = new ProductStore();

// express handler function
const index = async (req: express.Request, res: express.Response) => {
  const products = await store.index();
  res.json(products)
}

// to allow the handler above access to express method we create the function below, that takes in an instance of express application object as a parameter. The server.ts file will provide that when calls this function
const productRoutes = (app:express.Application) => {
  // we call express method, that match our routes and call the RESTful route handler to create a response
  app.get('/product', index)
}

export default productRoutes
```

### Call this route form server file
Add content to server.ts
```typescript
import express from 'express';
// import routes created for product
import productRoutes from './handlers/product'

const app: express.Application = express();
const port = 3000;

// set up endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Application Starting Page');
});

// use routes created for products
productRoutes(app)

// start server
app.listen(port, () => {
  console.log(`Server is listening on localhost:${port}`);
});
```

## Users

> IMPORTANT: when creating tables DO NOT use camelCase, the result from the database come back all lower case even if the migration table was set up with camelCase and than the property names of the User from the database doesn't match the property names of the User type.

### 1. Users Migrations
```bash
db-migrate create users-table --sql-file
```
Under `migrations\sqls\` add `sql` commands.
- in the `*-users-table-up.sql` 
```sql
/* Replace with your SQL commands */
CREATE TABLE users (
    userName VARCHAR(100),
    firstName VARCHAR(100), 
    lastName VARCHAR(100), 
    pasword_digest VARCHAR, 
    id SERIAL PRIMARY KEY
);
```
- in the `*-users-table-down.sql`:
```sql
DROP TABLE IF EXISTS users;
```

### 2. Users Model

-   install `bcrypt` for password encryption
```bash
npm i bcrypt
npm i --save-dev @types/bcrypt
```
- add following enviromental variables to `.env` file
```bash
BCRYPT_PASSWORD=secretBcryptPass
SALT_ROUNDS=10
```
  `SALT_ROUNDS` is the number of time the password will be hashed.
  <br>`BCYPT_PASSWORD` is the extra string used in the peppering step.
- add model file
```bash
touch src/models/user.ts
```
- add content
```typescript
// import bcrypt for password encryption
import bcrypt from 'bcrypt';
// import database connection
import client from '../database';
// import dotenv to handle environment variables
import dotenv from 'dotenv';

// initialize environment variables
dotenv.config();
const pepper: string = process.env.BCRYPT_PASSWORD as string;
const saltRounds: string = process.env.SALT_ROUNDS as string;

// create typescript type for user
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  password_digest: string;
};

// create Class representing table
export class UserStore {
  // add methods for CRUD actions

  async create(user: User, password_digest: string): Promise<User> {
    try {
      // function for password encryption
      const hash = bcrypt.hashSync(
        user.password_digest + pepper,
        parseInt(saltRounds)
      );
      // connect to database
      const conn = await client.connect();
      // add user
      const sql = `INSERT INTO users (firstName, lastName, password_digest) 
                VALUES ($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [
        user.firstName,
        user.lastName,
        password_digest,
      ]);
      const createdUser = result.rows[0];

      // disconnect from database
      conn.release();

      return createdUser;
    } catch (err) {
      throw new Error(`Couldn't create user. Error: ${err}`);
    }
  }
}

```
### 3. User Model Tests
```bash
touch src/tests/user_spec.ts
```
```typescript

```
### 4. User Handlers
```bash
touch src/handlers/user.ts
```
```typescript

```

### 5. Import User Handlers to `server.ts`