# Store App

Store App is an e-commerse website back-end.The API currently has the following endpoints:

## Store App REST API

The API uses `JSON Web Token` for authentication.

### Products
- index:  GET /products
- show: GET /products/:productId
- create: POST /porducts 

  *(Token required, only admin token is accepted)*
### Orders
- GET /orders/:userId/active 
  
  *(Token required only the user themselves or an admin can view the order)*

### Users
- index: GET /users 
  
  *(Token required, only admin user tokens are accepted.)*
- show: GET /users/:userId 
  
  *(Token required, only the user themselves or an admin can view the details.)*
- POST /users 

## Setup Application

### 1. Clone directory and install dependencies
```bash
git clone https://github.com/w314/storeApp.git
cd storeApp
npm install
```
### 2. Add `.env` file
```bash
touch .env
```
Add the following content to the  `.env` file:
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

### 3. Start `Docker` container
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

### 4. Start app
#### Start server:
```bash
npm run devStart
```
- This will populate the database with the mock data set and start the application.

#### Open application:
[http://localhost:3001/products](http://localhost:3001/products)

- The application will display the list of products in JSON format.

## Test the application 

### 1. Set up test database for testing 
The created docker container can be listed with:
```bash
sudo docker ps
```
Connect to docker container
```bash
sudo docker exec -it <container_id> bash
```
This will connect to the container. To connect to the database:
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

### 2. Run tests
```bash
npm run test
```
- Before the tests run, the test database is populated with mock data.
- 3 users are created: `admin`, regular `user` who has no active order, and a regular `userWithActiveOrder` who has an active order.
- `Jasmine` is used for testing, 40 scpecs run testing both the models and the API endpoints.
