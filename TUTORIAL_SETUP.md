# Store App Tutorial - Project Setup
>Step by step instructions to set up the store app project

## Create project directory
```shell
mkdir storeApp
cd storeApp
mkdir src
mkdir dist
mkdir src/models
echo "console.log('Hello World')" > src/server.ts
```

- for handlers
```bash
mkdir src/handlers
touch src/handlers product.ts
```


## Initiate `node` app 
```shell
npm init -y
```

## Setup `GIT` repository

1. Initiate a git repository
```shell
git init
```

2. Create `.gitignore` file 

```bash
echo '
node_modules
dist
' > .gitignore
```

3. Make initial commit
```shell
git add .
git commit -m 'Initial Setup'
```
4. Setup remote repository

```bash
git remote add origin <remote_repo_URL>
git push origin master
```


## Add `typescript`
1. Install 
```bash
npm i --save-dev typescript ts-node @types/node
```
2. Add configuration files

 Add `typescript config` file to project root directory
```bash
npx tsc --init
```
- set config file to (includes udacity project settings):
```javascript
{
  "compilerOptions": {
    "target": "ES2020",                          
    "lib": ["ES2015", "DOM"], 
    "module": "commonjs",                     
    "rootDir": "./src",   
    "outDir": "./dist",                     
    "strict": true,
    "noImplicitAny": true,                           
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
}
```

3. Add scripts to `package.json`
```javascript
  "scripts": {
    "start": "npm run build && node dist/server.js",
    "build": "npx tsc"
  },
  ```
Running `npm start` should log "Hello World".

## Add `eslint` and `prettier`

### 1. Install
```bash
npm i --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm i --save-dev prettier eslint-config-pr ettier eslint-plugin-prettier
```

### 2. Add configuration files

In project root directory:

  ```bash
  echo '{
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
      "@typescript-eslint",
      "prettier"
    ],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier"
    ],
    "rules": {
      "no-console": "off",
      "prettier/prettier": 2 // Means error
    }
  }
  ' > .eslintrc
  ```
  
  ```bash
  echo '{
    "semi": true,
    "singleQuote": true
  }' > .prettierrc
  ```

  ### 3. Add scripts to `package.json`

  In `package.json` under `scripts` add:
  ```javascript
  "scripts": {
    "prettier": "prettier --config .prettierrc \"src/**/*{js,ts,tsx}\" --write",
    "lint": "eslint \"src/**/*.{js,ts}\"",
  },
  ```

  `npm run prettier` and `npm run lint` should run now.

## Add Jasmine for testing

### 1. Install Jasmine
```bash
# install jasmine
npm i jasmine jasmine-spec-reporter
# install type definitions for jasmine
npm i --save-dev @types/jasmine

# install supertest for api endpoints testing
npm i --save-dev supertest
# install type definitions for supertest
npm i --save-dev @types/supertest
```

- [supertest](https://www.npmjs.com/package/supertest) is a module for testing HTTP

### 2. Create directory for tests
```bash
# test directory
mkdir src/tests
# directory for jasmine-spec-reporter helpers
mkdir src/tests/helpers
# file for jasmine-spec-reporter configuration
touch src/tests/helpers/reporter.ts
# directory for model tests
mkdir src/tests/models
# directory for API endpoint tests
mkdir src/tests/routes
# file for first spec
touch src/tests/models/product_spec.ts
```

### 3. Configure Jasmine & Jasmine Spec Reporter
- for `Jasmine`
```bash
npx jasmine init
```
Creates `spec` directory and `jasmine.json` configuration file.
In configuration file set:
```javascript
{
  "spec_dir": "dist/tests",
  "spec_files":  [
      "**/*[sS]pec.js"
  ],
  "helpers": [
    "helpers/**/*.js"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false 
}
```

For `jasemine-spec-reporter` add content to `tests/helpers/reporter.ts`:
```typescript
import { DisplayProcessor, SpecReporter, StacktraceOption } from 'jasmine-spec-reporter'
import SuiteInfo = jasmine.SuiteInfo

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: SuiteInfo, log: string): string {
    return `TypeScript ${log}`
  }
}

jasmine.getEnv().clearReporters()
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.NONE,
    },
    customProcessors: [CustomProcessor],
  })
)
```
### 4. Add test script to `package.json`
```javascript
"jasmine": "jasmine",
"test": "ENV=test && db-migrate --env test reset && db-migrate --env test up && npm run build && ENV=test npm run jasmine  && db-migrate --env test reset",

```
- `ENV=test` set the environment variable in `.env` file to test
> in windows use `set ENV=test`
- `db-migrate --env test up` runs the migrations to recreate the `schema` in the test database
- `ENV=test jasmine-ts` runs the test, `ENV=test` part needed here again otherwise runs it on regular database
-  `db-migrate db:drop test` clears the database after running the tests

Tests can be run by
- `npm run test`
- `npm run test --silent` if we don't want to see the npm error messages
### 5. Setup testing database
- in `.env` file add
```javascript
POSTGRES_TEST_DB=store_app_db_test
ENV=dev
```
Every time before running tests we will set `ENV` to `test`.

- Create test database

Start Postgres is termnal
```bash
psql -U postgres
```
Enter password for postgres user when `postgres=#` prompt appears.<br>
Create database for application
```sql
CREATE DATABASE store_app_db_test;
GRANT ALL PRIVILEGES ON DATABASE store_app_db_test TO store_app_user;
```

- Add connection to test database.The `database.ts` file should look like this now:
```typescript
import dotenv from 'dotenv'
import { Pool } from 'pg'


// intializing the environment variables
dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    ENV
} = process.env

// declare client
let client: Pool = new Pool();

// connect and set client to  test database
if(ENV ==='test') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    })
}

// connect and set client to dev database
if (ENV === 'dev') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    })    
}

export default client;
```
- Add test database to `database.json` file for `db-migration`:
```javascript

{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store_app_db",
    "user": "store_app_user",
    "password": "storeSecret"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store_app_db_test",
    "user": "store_app",
    "password": "storeSecret"
  }
}
```



## Add `express`

### 1. Install
```bash
npm i express
npm i --save-dev @types/express
npm i --save-dev tsc-watch
```
- `tsc-watch` will restart the server every time we save changes

2. Add script to `package.json`
  ```javascript
  "devStart": "tsc-watch --esModuleInterop src/server.ts --outDir ./dist --onSuccess 'node ./dist/server.js'",
  ```
  Running `npm run devStart` should output "Hello World" to the console.

3. Create basic server

  Replace corrent content of  the `src/server.ts` file with:
  ```typescript
  import express from 'express'
  
  const app = express();
  const port = 3000;  //can be any number > 1024
  
  // set up routes
  app.get('/api', (req, res) => {
    res.send('server working');
  });
  
  // start the server
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });  
  ```
Starting server with `npm run devStart`, opening th e browser at `localhost:3000` the page should display: "Application Starting Page"


## Create the database and the user the app will use
1. Start Postgres is termnal
```bash
psql -U postgres
```
Enter password for postgres user. When `postgres=#` prompt appears:
2. Create user for application
```sql
CREATE USER store_app_user WITH PASSWORD 'storeSecret';
```
3. Create database for application
```sql
CREATE DATABASE store_app_db;
GRANT ALL PRIVILEGES ON DATABASE store_app_db TO store_app_user;
```
4. Test database
Connect to the database:
```bash
\c store_app_db
\dt
```
Outputs: "Did not find any relations."


### Add `dotenv` to handle environment variables
1. Install
```bash
npm i dotenv
```

2. Create .env file to store environment variables
```bash
touch .env
```
Add variables to your `.env` file:
```bash
echo '
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store_app_db
POSTGRES_USER=store_app_user
POSTGRES_PASSWORD=storeSecret
' > .env
```

3. Add `.env` file to `.gitignore` to keep sensitive information local
```bash
echo ".env" >> .gitignore
```
4. Initialize environment variables in your program
```typescript
dotenv.config()
```
`dotenv.config()`  will create a javascript object called `process.env` which will have all the environment variables as properties.

```typescript
//environment variables can be accessed like:
process.env.POSTGRES_DB
// or
const { POSTGRES_DB } = process.env;
```


## Add `node-postgres`
node-postgres is a collection of node.js modules for interfacing with your PostgreSQL database. It has support for callbacks, promises, async/await, connection pooling, prepared statements, cursors, streaming results, C/C++ bindings, rich type parsing, and more.

### 1. Install
```bash
npm i pg
npm i --save-dev @types/pg 
```
### 2. Connect App to Postgres database
Create file to handle connection.
```bash
touch src/database.ts
```
Add code to file:
```typescript
import dotenv from 'dotenv'
import { Pool } from 'pg'

// intializing the environment variables
dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env

// connect to database
const client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
})

export default client;
```

## Add database migration tools

Migrations are documents outlining changes to the database over time, they are `tracking changes to the database schema`

### 1. Install `db-migrate`
```bash
yarn global add db-migrate
yarn add db-migrate db-migrate-pg
```
- installing `db-migrate` globally allows us to use the terminal commands it provides.
- `yarn add db-migrate` adds it to `package.json`
2. Add `database.json` file to project root directory
This reference file allows us to specify what database we want to run migrations on.
```bash
echo '
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store_app_db",
    "user": "store_app_user",
    "password": "storeSecret"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store_app_db_test",
    "user": "store_app_user",
    "password": "storeSecret"
  }
}' > database.json
```
## Add [`body-parser](https://www.npmjs.com/package/body-parser)
### 1. Install

```bash
npm i body-parser
```
Node.js body parsing middleware.
Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

### 2. Use `body-parser` into `server.ts` file
```typescript
// import body-parser
import bodyParser from 'body-parser'

// after declaring the app include
app.use(bodyParser.json())
```

## Add [morgan](https://www.npmjs.com/package/morgan)
>HTTP request logger middleware for node.js

### 1. Install
```bash
# install morgan
npm i morgan
# install types for morgan
npm i --save-dev @types/morgan
```

### 2. Use morgan in `server.ts` file
After the `app` is declared include line:
```typescript
app.use(morgan('dev'))
```

## Add [`JWT`](https://jwt.io/introduction/) (Json Web Token)

### 1. Install `JWT`
```bash
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken
```
### 2. Add new environmental variabel to `.env` file
```bash
TOKEN_SECRET=verySecretToken
```
### Useful  `JWT` methods:
- Create a token: `jwt.sign(<objectToIncludeInToken>, <TOKEN_SECRET>)`
- Check a token: `jwt.verify()`