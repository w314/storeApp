# Store App Tutorial - Backend
>Step by step instructions to create the an e-store back end.

Work Flow
1. Set Environmental Variables
1. Create Database
1. Create Migrations
1. Create Models
1. Create Tests for Models
1. Create Handlers
1. Test api endpoints

## 1. Set Environmental Variables
```bash
# for setting environment
ENV=dev
# for postgres database
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5555
POSTGRES_DB=store_db
POSTGRES_DB_TEST=store_db_test
POSTGRES_USER=store_user
POSTGRES_PASSWORD=store_pass
# for JSON Web Token
TOKEN=very_secret_pass
# for bcrypt
BCRYPT_PASSWORD=secretBcryptPass
SALT_ROUNDS=10
```

## 2. Create the Database

### 2.1 Start `Docker` container
In the terminal run
```bash
sudo docker compose up -d
```
- `-d` will run container in the background
- The `docker-compose.yaml` file will set up the container running postgres.
- It creates the database with the name specified as `POSTGRES_DB` in the `.env`and user from the .env 
file
- It will use the user `POSTGRES_USER` and the password `POSTGRES_PASSWORD` set in the `.env` file


- In case of the error:
`docker-compose up cannot start service postgres: driver failed programming external connectivity on endpoint`, 
<br>A) stop local postgresql with:
    ```bash
    sudo service postgresql stop
    ```
    <br>B) Change post assignment in `docker-compose.yml` file:
    ```bash
    ports:
      - '5433:5432'
    ```

    And run `docker-compose` up again.

### 2.2 Create test database

The created docker container can be listed with:
```bash
sudo docker ps
```
Connect to the `postgres container`:
```bash
sudo docker exec -it <container_name> bash
```
- `-it` makes the connection interactive

Start `postgres` in termnal
```bash
psql -U store_user store_db
```
Create test database:
```sql
CREATE DATABASE store_db_test;
```

Test database
Connect to the database:
```bash
\c store_db_test
\dt
```
Outputs: "Did not find any relations."


## 3 Create Migrations 
Migrations will set up our database schema 

Based on our schema migrations have to be created for the following database tables:
1. users
1. products
1. categories
1. orders
1. order_items

For each migration we will run the `db migrate create` command. At the first run it will create:
- a `migrations` directory in our project root directory
- an `sqls` directory under migrations
- migrations will run in order of their creation, so have to be created in logical order (to run without error category table migration has to be run before product table migration)
- in case categories are introduced later and the order of migration has to be changed one can change the date in the name of the migration files (if the up and down migration file names are, their names have to be updated *within* the automatically generated `.js` migration file)


At each run it will create:
- a generated `.js` file that should not be modified under `migrations`
- two `.sql` files under the `sqls` directory with for the up and down migrations
  - into the `up` migration file you will enter the `sql` command that  will setup your table
  - the `down` migration file will hold the `sql` command to the migration you just did in the `up` migration
  
>IMPORTANT: when creating tables DO NOT use camelCase, the result from the database comes back all lower case even if the migration table was set up with camelCase and than the property names of the User from the database doesn't match the property names of the User type.
### 3.1 Add migrations
#### 3.1.1 users
create migration file:
```bash
db-migrate create users-table --sql-file
```
add up migration:
```sql
CREATE TYPE usertype AS ENUM ('admin', 'regular');
CREATE TABLE users (
    username VARCHAR(100) UNIQUE,
    firstname VARCHAR(100) NOT NULL, 
    lastname VARCHAR(100) NOT NULL, 
    password_digest VARCHAR NOT NULL,
    user_id SERIAL PRIMARY KEY,
    user_type usertype NOT NULL
);
```
add down migration:
```sql
DROP TYPE IF EXISTS usertype CASCADE;
DROP TABLE IF EXISTS users;
```
#### 3.1.2 categories
create migration file:
```bash
db-migrate create categories-table --sql-file
```
add up migration:
```sql
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL
);
```
add down migration:
```sql
DROP TABLE IF EXISTS categories;
```
#### 3.1.3 products
create migration file:
```bash
db-migrate create products-table --sql-file
```
add up migration:
```sql
CREATE TABLE products (
    name VARCHAR(100) NOT NULL, 
    price float NOT NULL, 
    product_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories ON DELETE RESTRICT
);
```
add down migration:
```sql
DROP TABLE IF EXISTS products CASCADE;
```
#### 3.1.4 orders
create migration file:
```bash
db-migrate create orders-table --sql-file
```
add up migration:
```sql
CREATE TYPE orderstatus AS ENUM ('active', 'completed');
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users ON DELETE RESTRICT,
  order_status orderstatus NOT NULL
);
```
add down migration:
```sql
DROP TYPE IF EXISTS orderstatus CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
```
#### 3.1.5 order_items
create migration file:
```bash
db-migrate create order_items-table --sql-file
```
add up migration:
```sql
CREATE TABLE order_items (
  item_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders ON DELETE RESTRICT,
  product_id INT NOT NULL REFERENCES products ON DELETE RESTRICT,
  quantity INT NOT NULL
);
```
add down migration:
```sql
DROP TABLE  IF EXISTS order_items;
```

### 3.2 Update scripts in `package.json`
3.2.1.  add `migrate` script
```javascript
"migrate": "ENV=test && db-migrate --env test reset && db-migrate --env test up",
```
- `ENV=test` set the environment variable in `.env` file to test (in windows use `set ENV=test`)
- `db-migrate --env test reset` clears any migrations run on the database before. It is needed in case test run was not complete last time and the reset after the test run couldn't clear the database
- `db-migrate --env test up` runs the migrations to recreate the `schema` in the test database
    
3.2.2 update `devStart` script
```javascript
"devStart": "npm run migrate && nodemon src/server.ts",
```
- `devStart` will run the `migrate` script before starting the application

3.2.3 update `test` script
```javascript
"test": npm run migrate && ENV=test npm run jasmine  && db-migrate --env test reset",
```
- the new script will run `migrate` first
- `ENV=test jasmine-ts` runs the tests on the test database, `ENV=test` part needed here again otherwise runs it on regular database
- running `db-migrate --env test reset` clears the test database

There are no migrations to in the `start` script as that would delete all live data in the database. 

### 3.3 Run migrations
In project root directory run:
```bash
db-migrate up
```
## 4. Create Models
- `models` will support `CRUD` actions on the tables created during `migration`. 
- we have to create models for all our tables

### Product Models

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
<br>Each model file will have its handler file. This file will have all the handler functions associated with the REST-ful routes regarding that model.
 Import handlers to server file

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


## To modify already created endpoints

>Add category property to product.

### 1. Cretae migration for categories table
```bash
db-migrate create categories-table --sql-file
```
- up migration

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);
```

- down migration
```sql
DROP TABLE IF EXISTS categories;
```

### 2. Modify migration of products table
```sql
CREATE TABLE products (
    name VARCHAR(100), 
    price float, 
    product_id SERIAL PRIMARY KEY,
    category_id INT,
    CONSTRAINT fk_category
        FOREIGN KEY(category_id)
            REFERENCES categories(category_id)
            ON DELETE SET NULL
);
```
- migrations are run in creation order
- to be able to run without error category table migration has to be run before product table migration
- to do that one can change the date in the name of the migration file
- it's probably enough to change the name of the `.js` file, if the up and down migration file names are also changed, their names have to be updated within the `.js` file





## Add orders


### 2. Model for Orders
- create Order type
- create OrderStore class and add methods


### 3. Handler for Orders
- add methods
- create orderRoutes: assign methods to endpoints
- export orderRoutes
- in `server.ts` file call orderRoutes
