# Store App Tutorial - Project Setup
>Step by step instructions to set up the basic node application that  we will use to develop the store app project. The application will make use of the following tools:
- typescipt
- prettier
- eslint
- express
- jasmine
- morgan
- body-parser
- dotenv
- node-postgres
- db-migrate, db-migrate-pg
- jwt
- docker



## Create project directory
```bash
mkdir storeApp
cd storeApp
mkdir src
mkdir dist
mkdir src/models
mkdir src/handlers
mkdir src/tests
touch src/server.ts
echo "console.log('Hello World')" > src/server.ts
```

## Initiate [node](https://nodejs.org/en/) app 
```bash
npm init -y
```

## Setup [GIT](https://git-scm.com/) repository

1. Initiate a git repository
```bash
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
git commit -m 'feat: Initial commit'
```
4. Setup remote repository

```bash
git remote add origin <remote_repo_URL>
git push origin master
```


## Add [typescript](https://www.typescriptlang.org/)
1. Install 
```bash
npm i --save-dev typescript ts-node @types/node
```
2. Add configuration files

 Add `typescript configuration` file to project root directory
```bash
npx tsc --init
```
- creates `tsconfig.json`
- use settings below in `tsconfig.json`:
```javascript
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2020",                          
    "lib": ["ES2015", "DOM"], 
    /* Modules */
    "module": "commonjs",                     
    "rootDir": "./src",   
    /* Emit */
    "outDir": "./dist",   
    /* Interop Constraints */                  
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
    /* Type Checking */
    "strict": true,
    "noImplicitAny": true,                           
    "skipLibCheck": true,
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
- `build` will convert typescript to javascript and store the files under the `./dist` folder (set as the `outdir` in `tsconfig.json`) 
- `start` will run build and start the application by using `node` to run the `./dist/server.js` file
- Running `npm start` logs "Hello World".

4. Commit changes
```bash
git add .
git commit -m 'chore: Add typescript to project'
```

## Add [eslint](https://eslint.org/) and [prettier](https://prettier.io/)

### 1. Install
```bash
npm i --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm i --save-dev prettier eslint-config-prettier eslint-plugin-prettier
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
    "eslint": "eslint \"src/**/*.{js,ts}\"",
    "lint": "npm run prettier && npm run eslint",
  },
  ```
- run `npm run lint` to run both prettier and eslin. Prettier will automatically correct mistakes while eslint will show a list of errors and warnings.

### 4. Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'chore: Add Eslint and prettier to project'
```



## Add [Express](https://expressjs.com/)

### 1. Install
```bash
npm i express
npm i --save-dev @types/express
npm i --save-dev tsc-watch
```
- `tsc-watch` will restart the server every time we save changes

### 2. Create basic server

  Replace corrent content of  the `src/server.ts` file with:
```typescript
import express from 'express'

const app = express();
const port = 3000;  //can be any number > 1024

// middlewares

// set up routes
app.get('/api', (req, res) => {
  res.send('server working');
});

// start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});  

export default app;
```
  - running `npm run start` logs: 
  `Server started at: localhost:3000`.
  - opening the browser at `localhost:3000` the page displays: `Server is working.`

### 3. Add `devStart` script to `package.json`

Script `devStart` will be used during development as it uses `tsc-watch` to restart the server after every change in the application.

  ```javascript
  "devStart": "tsc-watch --esModuleInterop src/server.ts --outDir ./dist --onSuccess 'node ./dist/server.js'",
  ```
  - running `npm run devStart` produces the same result as running `npm start` before

### 4. Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'chore: Add Express to project'
```

## Add [Jasmine](https://jasmine.github.io/) for testing

### 1. Installation
```bash
# install jasmine and jasmine-spec-reporter
npm i jasmine jasmine-spec-reporter
# install type definitions for jasmine
npm i --save-dev @types/jasmine

# install supertest for api endpoints testing
npm i --save-dev supertest
# install type definitions for supertest
npm i --save-dev @types/supertest
```
- [jasmine-spec-reporter](https://www.npmjs.com/package/jasmine-spec-reporter) is a real time console spec reporter for `jasmine`
- [supertest](https://www.npmjs.com/package/supertest) is a module for testing HTTP

### 2. Setup test directory
```bash
# directory for jasmine-spec-reporter
mkdir src/tests/helpers
# directory for model tests
mkdir src/tests/models
# directory for API endpoint tests
mkdir src/tests/routes
# directory for utility tests
mkdir src/tests/utilities
```

### 3. Configuration

#### `Jasmine`
Run:
```bash
npx jasmine init
```
- Creates `spec` directory and `jasmine.json` configuration file.
- In configuration file set:
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

#### `jasemine-spec-reporter`
Create file: 
```bash
# file for jasmine-spec-reporter configuration
touch src/tests/helpers/reporter.ts
```
With content:
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
### 4. Create spec file for server.ts
Create spec file:
```bash
# file for first spec
touch src/tests/server_spec.ts
```
With content:
```typescript
import { agent as request } from 'supertest';
import app from '../server';

describe('GET /', () => {
  it('responds with: Server is working.', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .then((response) => {
        expect(response.text).toBe('Server is working.');
        done();
      })
      .catch((Error) => {
        Error ? done.fail(Error) : done();
      });
  });
});
```

### 5. Add test script to `package.json`
```javascript
"jasmine": "jasmine",
"test": "npm run build && npm run jasmine",
```
- running `npm run test` builds the project and succesfully runs the one spec we created

### 6. Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'chore: Add Jasmine to project'
```

## Add [morgan](https://www.npmjs.com/package/morgan)
HTTP request logger middleware for node.js

### 1. Install
```bash
# install morgan
npm i morgan
# install types for morgan
npm i --save-dev @types/morgan
```

### 2. Use morgan in `server.ts` file
```typescript
// import morgan, an HTTP request logger middleware
import morgan from 'morgan';

/*After the `app` is declared under `middlewares` include:*/

// log HTTP requests
app.use(morgan('dev'));
```
- running `npm run test` will show `morgan` logging the http request of our spec

### 3. Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'chore: Add morgan to project'
```

## Add [`body-parser](https://www.npmjs.com/package/body-parser)
Node.js body parsing middleware.
Parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.

### 1. Install
```bash
npm i body-parser
```

### 2. Usage
To use `body-parser` edit the  `server.ts` file:
```typescript
// import bodyParser, an HTTP request body parser middleware
import bodyParser from 'body-parser';

////after declaring the `app` under `middlewares` include

// parse the HTTP request body
app.use(bodyParser.json());
```
### 3. Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'chore: Add body-parser to project'
```

## Add [dotenv](https://www.npmjs.com/package/dotenv) 
Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. It gives us a way to store environment variables separate from code
### 1. Install
```bash
npm i dotenv
```

### 2. Create .env file 
`.env` file will store the  environment variables
```bash
touch .env
```
With content:
```bash
POSTGRES_HOST=toBeSet
POSTGRES_PORT=toBeSet
POSTGRES_DB=toBeSet
POSTGRES_DB_TEST=tobeSet
POSTGRES_USER=toBeSet
POSTGRES_PASSWORD=toBeSet
ENV=dev
```
- variables will be set, when we create our database as we develop the application
- we will set up a database as well and a test database for our application and use the `ENV` variable to set the current environment (development or test)

### 3. Add `.env` file to `.gitignore`
It will keep sensitive information local.
```bash
echo ".env" >> .gitignore
```
### 4. Usage
Store you environment variables in the `.env` file:
```bash
YOUR_VARIABLE=myvariable
```
If you want to use the environment variables stored in the `.env` file:
```typescript
 //Initialize environment variables in your program
dotenv.config()
```
`dotenv.config()`  will create a javascript object called `process.env` which will have all the environment variables as properties.

```typescript
//environment variables can be accessed like:
process.env.YOUR_VARIABLE
// or
const { YOUR_VARIABLE } = process.env;
```
### 5. Commit changes
```bash
git add .
git commit -m 'chore: Add dotenv to project'
```

## Add [node-postgres](https://node-postgres.com/)
`node-postgres` is a collection of node.js modules for interfacing with a PostgreSQL database.

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
With content:
```typescript
/* this file connects the application to the postgres database */
// import dotenv, to process environment variables stored in the `.env` file
import dotenv from 'dotenv';
// import pool, to connect to the database
import { Pool } from 'pg';

// intialize environment variables
dotenv.config();

// get environmental variables
const { 
  POSTGRES_HOST,
  POSTGRES_PORT, 
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER, POSTGRES_PASSWORD,
  ENV 
} =  process.env;

// declare client
const client = new Pool({
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT as string),
  database: ENV == "dev" ? POSTGRES_DB : POSTGRES_DB_TEST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

export default client;
```
### 3. Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'chore: Add node-postgres to project'
```

## Add [db-migrate](https://github.com/db-migrate/node-db-migrate#readme)

`db-migrate` is a database migrations framework for nodejs. Migrations are documents used to build the database and track changes to its schema over time.

### 1. Install
```bash
npm install --save-dev db-migrate
npm install --save-dev db-migrate-pg
```
- installing `db-migrate` globally allows us to use the terminal commands it provides.???
- [db-migrate-pg](https://www.npmjs.com/package/db-migrate-pg) is a postgres driver for db-migrate


### 2. [Configuration](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/configuration/)
Create `database.json` file in project root directory
```bash
touch database.json
```
- The `database.json` file specifies what database we want to run migrations on. It supports the concept of environments.You can pass the -e or --env option to db-migrate to select the environment you want to run migrations against. 
- You can also specify environment variables in your config file by using a special notation.
- Set up the `database.json` file like below:


```typescript
{
    "dev": {
        "driver": "pg",
        "host":{"ENV": "POSTGRES_HOST"},
        "database": {"ENV": "POSTGRES_DB"},
        "user": {"ENV": "POSTGRES_USER"},
        "password": {"ENV": "POSTGRES_PASSWORD"}
    },
    "test": {
        "driver": "pg",
        "host": {"ENV": "POSTGRES_HOST"},
        "database": {"ENV": "POSTGRES_DB_TEST"},
        "user": {"ENV": "POSTGRES_USER"},
        "password": {"ENV": "POSTGRES_PASSWORD"}
    }
}
```
### 3. Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'chore: Add db-migrate to project'
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

### 3. Commit changes
```bash
git add .
git commit -m 'chore: Add jwt to project'
```
## Add [docker](https://www.docker.com/)
The application will use Postgres run in a docker container. To do that you have to have 
[docker compose](https://docs.docker.com/compose/)
### 1. Install [docker](https://www.docker.com/) and [docker compose](https://docs.docker.com/compose/) if needed

### 2. Add `YAML` file
This `docker-compose.yml` file will configure the container we are running.
```bash
touch docker-compose.yml
```
Add content:
```bash
version: '3.9'

services:
  postgres:
    image: postgres
    ports:
      - '5555:5432'
    env_file:
      - .env
    volumes:
      - 'postgres:/var/lib/postgresql/data'

volumes:
  postgres:
```

### 3. Commit changes
```bash
npm run lint
```
```bash
git add .
git commit -m 'chore: Add docker-compose.yml file to project'
```