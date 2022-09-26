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
POSTGRES_PORT=5555
POSTGRES_DB=store_db
POSTGRES_DB_TEST=store_db_test
POSTGRES_USER=store_user
POSTGRES_PASSWORD=your_password
# for JSON Web Token
TOKEN=your_secret
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

### Set up test database if using 
Connect to docker container
```bash
sudo docker exec -it <container_id> bash
```
This will connect to the container. To connec to the database:
```bash
psql -U <POSTGRES_USER> <POSTGRES_DB>
```
Or in one step:
```bash
docker exec -it <container_id> psql -U <POSTGRES_USER> <POSTGRES_DB>
```

Create test database
```sql
CREATE DATABASE store_app_db_test;
```

### Run migrations
If you are using application in dev mode and start it with `npm run devStart` it will use the test database and the script will run the migration. 

However if you start the application with `npm run start` you will have to run migrations to set up the live database before first time use.






##  Start the application

1. In the terminal start docker container
```bash
sudo docker-compose up
```
2. In the terminal in project directory start the application
```bash
npm start
```
3. open application in browser: `localhost:3000`

## How to use the app



