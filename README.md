# Store App

## Installation

### 1. Clone directory
```bash
git clone https://github.com/w314/storeApp.git
```
### 2. Install dependencies
<br>In the terminal, in the project root directory run:
```bash
npm install
```
### 3. Add `.env` file
```bash
touch .env
```
In the `.env` file add content:
```bash

```
##  Start the application
### 1. Setup `Docker` container
<br>In the terminal run
```bash
sudo docker-compose up -d
```
- `-d` will run container in the background

- In case of the error:
`docker-compose up cannot start service postgres: driver failed programming external connectivity on endpoint`, 
stop local postgresql with:
    ```bash
    sudo postgresql stop
    ```
    And run `docker-compose` up again.

The created docker container can be listed with:
```bash
docker ps
```

### Connect to docker container
```bash
docker exec -it <container_id> bash
```
This will connect to the container. To connec to the database:
```bash
psql -U <POSTGRES_USER> <POSTGRES_DB>
```
Or in one step:
```bash
docker exec -it <container_id> psql -U <POSTGRES_USER> <POSTGRES_DB>
```

### Create test database
```sql
CREATE DATABASE store_app_db_test;
```

CHanged jasmine test script (documented in TUTTORIAL) after that could create procut in table.

## How to use the app

