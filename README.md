# Store App


## Step by step instructions to build store app

### Setup 
#### Create project directory
```shell
mkdir storeApp
cd storeApp
mkdir src
mkdir dist
echo "console.log('Hello World')" > src/server.ts
```

#### Initiate `node` app 
```shell
npm init -y
```

#### Setup `GIT` repository

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


#### Add `typescript`
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

#### Add `eslint` and `prettier`

1. Install
```bash
npm i --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm i --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

2. Add configuration files

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

  3. Add scripts to `package.json`

  In `package.json` under `scripts` add:
  ```javascript
  "scripts": {
    "prettier": "prettier --config .prettierrc \"src/**/*{js,ts,tsx}\" --write",
    "lint": "eslint \"src/**/*.{js,ts}\"",
  },
  ```

  `npm run prettier` and `npm run lint` should run now.

#### Add `express`

1. Install
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


#### Create the database and the user the app will use
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


#### Add `dotenv` to handle environment variables
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


#### Add `node-postgres`
node-postgres is a collection of node.js modules for interfacing with your PostgreSQL database. It has support for callbacks, promises, async/await, connection pooling, prepared statements, cursors, streaming results, C/C++ bindings, rich type parsing, and more.

1. Install
```bash
npm i pg
npm i --save-dev @types/pg 
```
2. Connect App to Postgres database
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

#### Add database migration

Migrations are documents outlining changes to the database over time, they are `tracking changes to the database schema`

1. Install `db-migrate`
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
    "user": "store_app_user_test",
    "password": "storeSecretTest"
  }
}' > database.json
```

3. Create migrations

In terminal run:
```bash
db-migrate create items-table --sql-file
```


4. Run migrations
```bash
db-migrate up
```


