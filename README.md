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




