# Store App Tutorial - Backend
>Step by step instructions to create the Store App.

Work Flow
1. Set Environmental Variables
1. Create Database
1. Create Migrations
1. Create and Test Models
1. Create and Test Routes

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
- It creates the database with the name and user specified as `POSTGRES_DB` in the `.env` file.
- It will create the user `POSTGRES_USER` with the password `POSTGRES_PASSWORD` set in the `.env` file


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

To check creation of  test database, connect to the database:
```bash
\c store_db_test
```
Outputs: You are now connected to database "store_db_test" as user "store_user".


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
- in case categories are introduced later and the order of migration has to be changed one can change the date in the name of the migration files (if the up and down migration file names are changed, their names have to be updated *within* the automatically generated `.js` migration file)


At each run it will create:
- a generated `.js` file that should not be modified under `migrations`
- two `.sql` files under the `sqls` directory with for the up and down migrations
  - into the `up` migration file you will enter the `sql` command that  will setup your table
  - the `down` migration file will hold the `sql` command to reverse the commands you just entered in the `up` migration file
  
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
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    firstname VARCHAR(100) NOT NULL, 
    lastname VARCHAR(100) NOT NULL, 
    password VARCHAR NOT NULL,
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
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
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
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, 
    price float NOT NULL, 
    url VARCHAR(300),
    description VARCHAR(600),
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
  id SERIAL PRIMARY KEY,
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
  id SERIAL PRIMARY KEY,
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
"test": npm run migrate && npm run build && ENV=test npm run jasmine  && db-migrate --env test reset",
```
- the new script will run `migrate` first
- `ENV=test jasmine-ts` runs the tests on the test database, `ENV=test` part needed here again otherwise runs it on regular database
- running `db-migrate --env test reset` clears the test database

There are no migrations to in the `start` script as that would delete all live data in the database. To run migration on the live database run `db-migrate up` in project root directory

### 3.3 Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'feat: Create migrations for project'
```

## 4. Create Models
-  a table in the database can be represended as a class in typescript
- CRUD actions are created as methods of the class


### 4.1 Setup Test Database
Before running any test we will delete all previous data from all tables, reset primary keys to 0, and populate tables with a starting set of values.

to clear tables add file:
```bash
touch src/tests/utilities/dbCleaner.ts
```
with content:
```typescript
// import database client
import client from '../../database'


// create dbCleaner function
const dbCleaner = async () => {

    // create array of all tables in database
    const tables = [
        'users',
        'categories',
        'products',
        'orders',
        'order_items'
    ]
    
    try {
        // connect to database
        const conn = await client.connect()

        // delete content of each table in our tables array
        // and reset the primary keys
        tables.forEach(async (table) => {
            await conn.query(`TRUNCATE ${table} RESTART IDENTITY CASCADE`)
        })
  
        // disconnect from database
        conn.release()
    } catch(err) {
        // throw error if could not connect to database
        throw new Error(`Could not connect to database: ${err}`)
    }
}

export default dbCleaner
```

to setup database add file:
```bash
touch src/tests/utilities/dbSetup.ts
```
with content:
```typescript

```

### 4.2 User Model
#### 4.2.1 Create User Model
add model file:
```bash
touch src/models/user.ts
```
wit content:
```typescript
// import database client
import client from '../database';
// import bcrypt for password encryption
import bcrypt from 'bcrypt';
// import dotenv to handle environment variables
import dotenv from 'dotenv';
// import jwt for authentication
import jsonwebtoken from 'jsonwebtoken';

// initialize environment variables
dotenv.config();
const {
    PEPPER,
    SALT_ROUNDS,
    TOKEN_SECRET
} = process.env
// // const pepper: string = process.env.BCRYPT_PASSWORD as string;
// // const saltRounds: string = process.env.SALT_ROUNDS as string;
// // const tokenSecret: string = process.env.TOKEN_SECRET as string;

// create typescript type for user
export type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  user_type: string;
};

// create UserStore class representing user table
export class UserStore {

  /* add authenticate method for sign-in
     returns jwt token if sign-in is valid
     returns null if user name is invalid
     throws Error if password is incorrect */
  async authenticate(userName: string, password: string): Promise<string | null> {
    try {
        // connect to database
        const conn = await client.connect();
        // get user from database
        const sql = `SELECT * FROM users WHERE username = $1`;
        const result = await conn.query(sql, [userName]);

        // disconnect from database
        conn.release();

        // if result has nonzero length the username was valid
        if (result.rows.length) {
            //// console.log(result.rows.length)
            //// for(let i = 0; i<result.rows.length; i++) {
            ////   console.log(result.rows[i])
            //// }

            // the user is:
            const user: User = result.rows[0];

            // compare user's password at sign-in with provided hashed version
            //// console.log(`User password coming from db after creation: ${user.password_digest}`)
            //// console.log(`User submitted this password: ${password}`)
            if (bcrypt.compareSync(password + PEPPER, user.password)) {
              // password is valid create and send jwt token
                //// console.log(`password OK`)
                return jsonwebtoken.sign(user, TOKEN_SECRET as string)
            }
            else {
              // password was invalid
            //// console.log('invalid password')
                throw new Error(`Invalid password`)
            }
      }
      // result length was zero, username is invalid, return null
      return null;
    } catch (err) {
      console.log(`username was valid, but error at authentication: ${err}`)
      throw new Error(`Could not authenticate user. ${err}`);
    }
  }

  // add methods for CRUD actions

  // INDEX: give a list of all users
  async index(): Promise<User[]> {
    try {
      // connect to database
      const conn = await client.connect();
      // console.log(conn)
      // get user list
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      // console.log(result)
      // disconnect from database
      conn.release();
      // return user list
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get user list. Error: ${err}`);
    }
  }

  // SHOW: show one specific user
  async show(userId: number): Promise <User> {
    try {
      // connect to database
      const conn = await client.connect()
      // get user
      const sql = `SELECT * FROM users WHERE id = $1`
      const result = await conn.query(sql, [userId])
      // disconnect from database
      conn.release()
      // return user
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get user. Error: ${err}`)
    }
  }

  // CREATE: create user and return created user
    async create(user: User): Promise<User> {
    try {
        // create password hash
        const hash = bcrypt.hashSync(
            user.password + PEPPER,
            parseInt(SALT_ROUNDS as string)
        );
        // connect to database
        const conn = await client.connect();
        // sql command to insert user
        const sql = `INSERT INTO users (username, firstname, lastname, password, user_type)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        // run command and capture returned user
        const result = await conn.query(sql, [
            user.username,
            user.firstname,
            user.lastname,
            hash,
            user.user_type
        ]);
        const createdUser = result.rows[0];

        // disconnect from database
        conn.release();

        // return created user
        return createdUser;
    } catch (err) {
      throw new Error(`Couldn't create user. Error: ${err}`);
    }
  }
}
```

#### 4.2.2 Test User Model
create file:
```bash
touch src/tests/models/user_spec.ts
```
with content:
```typescript

```

#### 4.2.3 Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'feat: Add User model and its tests to project'
```

### 4.3 Category Model
#### 4.3.1 Create Category Model
add model file:
```bash
touch src/models/category.ts
```
wit content:
```typescript

```
- this version of the app will not provide opportunity to edit or delete categories (all possible categories will be provided at database setup)

#### 4.3.2 Test Category model
Due to limited use of category model in this version of the app, there are no tests for it.

#### 4.3.3 Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'feat: Add Category model for project'
```

### 4.4 Product Model
#### 4.4.1 Create Product Model
add model file:
```bash
touch src/models/product.ts
```
wit content:
```typescript

```
#### 4.4.2 Test Product Model
add file
```bash
touch src/tests/models/product_spec.ts
```
with content:
```typescript

```

#### 4.4.3 Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'feat: Add Product model to project'
```


### 4.5 Order Model
The order model will handle both the orders and order_items table of the database.

#### 4.5.1 Create Order Model
add model file:
```bash
touch src/models/order.ts
```
wit content:
```typescript

```

#### 4.5.2 Test Order Model
add file
```bash
touch src/tests/models/order_spec.ts
```
with content:
```typescript

```


#### 4.5.3 Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'feat: Add Order model and its tests to project'
```

## 5. Routes
- Each model file will have its routes file. 
- This file will have all the functions (like: create) the application needs for to provide response to the REST-ful routes regarding that model.
- This file will have a variable (like: UserRoutes) that will match the HTTP requests with their corresponding methods. (like: app.post('/users' create))
- These Routes will be imported to the `server.ts` file to handle incoming requests

### 5.1 Create verifyAuthToken function
We create the function to check the authenticity of the user.

create file:
```bash
mkdir src/routes/utilities
touch src/routes/utilities/verifyAuthToken.ts
```

### 5.1 User Route
create file:
```
touch src/handlers/user.ts
```

with content:
```typescript
// add methods

// create userRoutes 

```

import route to server file:<br>`server.ts`:
```typescript
// import user routes
import userRoutes from './routes/user';

// OTHER CODE 
// app.get ...

// pass our express app to our routes
userRoutes(app);
```

create test file:
```bash
touch src/tests/routes/user_api_spec.ts
```

`user_api_spec.ts`:
```typescript

```

**********************************
OLD NOTES
************************************

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



### 3. Handler for Orders
- add methods
- create orderRoutes: assign methods to endpoints
- export orderRoutes
- in `server.ts` file call orderRoutes
