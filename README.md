# Store App

Store App is a node application that serves as the back end of an online store. 

## Setup Application

### 1. Clone directory
```bash
git clone https://github.com/w314/storeApp.git
```
### 2. Install dependencies
<br>In the terminal, in the project root directory run:
```bash
cd storeApp
npm install
```
### 3. Add `.env` file
```bash
touch .env
```
In the `.env` file add content:
```bash
# for setting environment
ENV=dev
# for postgres database
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5554
POSTGRES_DB=store_db
POSTGRES_DB_TEST=store_db_test
POSTGRES_USER=store_user
POSTGRES_PASSWORD=password
# for JSON Web Token
TOKEN_SECRET=secret
# for bcrypt
BCRYPT_PASSWORD=your_bcrypt_pass
SALT_ROUNDS=10
```

### Start `Docker` container
<br>In the terminal run
```bash
sudo docker compose up -d
```
- `-d` will run container in the background

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


The created docker container can be listed with:
```bash
sudo docker ps
```

### Set up test database for testing 
Connect to docker container
```bash
sudo docker exec -it <container_id> bash
```
This will connect to the container. To connec to the database:
```bash
psql -U store_user store_db
```
Or in one step:
```bash
docker exec -it <container_id> psql -U store_user store_db
```

Create test database
```sql
CREATE DATABASE store_db_test;
```

##  Start the application

In the terminal in the project directory start the application with: 
```bash
npm run devStart
```
Open application in browser: `localhost:3001` 

The application will display: "Application Starting Page"

## Run tests
In the terminal in the project root directory run:
```bash
npm run test
```
Before the tests run, a the `DbSetup` class `setup()` method is called to populate the database with data. During setup 3 users are created: `admin`, regular `user` who has no active order, and a regular `userWithActiveOrder` who has an active order. These users are properties of the `DbSetup` class and are used throughout the tests.

## Use the applications
The application provides the following API endpoints:
### User related
#### 1. Create user  
- endpoint: POST /users
- NO TOKEN required (it allows people to sign up for being users without any admin's approval)

#### 2. List users
- endpoint: GET /users
- TOKEN REQUIRED, only admin user tokens are accepted

#### 3. Show details of a certain user
- endpoint: GET /users/userId
- TOKEN REQUIRED, only the user themselves or an admin can view the details

### Porduct related

#### 1. List all products
- endpoint: GET /products
- NO TOKEN required

#### 2. Show details of a specific product
- endpoint: GET /products/productId
- NO TOKEN required

#### 3. Create new product
- endpoint: POST /products
- TOKEN REQUIRED, only admin token is accepted

### Order Related
#### 1. Show active order of user
- endpoint GET /orders/userId
- TOKEN REQUIRED, only the user themselves or an admin can view the order





