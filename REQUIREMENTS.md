## API Endpoints
#### Products
- Index - GET /products
- Show - GET /products/productId
- Create - POST /products

#### Users
- Index - GET /users 
- Show - GET /users/userId 
- Create - POST /users

#### Orders
- Current Order by user - GET /orders/userId

## Database Schema

### `users` table

`users` table uses `usertype` type
```sql
 TYPE usertype AS ENUM ('admin', 'regular');
 ```

columns:
```sql
id SERIAL PRIMARY KEY,
username VARCHAR(100) UNIQUE,
firstname VARCHAR(100) NOT NULL, 
lastname VARCHAR(100) NOT NULL, 
password VARCHAR NOT NULL,
user_type usertype NOT NULL
```

### `categories` table

columns:
```sql
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL
```

### `products` table

columns:
```sql
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL, 
price float NOT NULL, 
url VARCHAR(300),
description VARCHAR(600),
category_id INT NOT NULL REFERENCES categories ON DELETE RESTRICT
```
### `orders` table

`orders` table uses `orderstatus` type:
```sql
CREATE TYPE orderstatus AS ENUM ('active', 'completed');
```

columns:
```sql
id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users ON DELETE RESTRICT,
order_status orderstatus NOT NULL
```

### `order_items` table

columns:
```sql
id SERIAL PRIMARY KEY,
order_id INT NOT NULL REFERENCES orders ON DELETE RESTRICT,
product_id INT NOT NULL REFERENCES products ON DELETE RESTRICT,
quantity INT NOT NULL
```

<hr>

## Project Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

