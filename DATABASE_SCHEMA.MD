# Database Schema

## `users` table

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

## `categories` table

columns:
```sql
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL
```

## `products` table

columns:
```sql
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL, 
price float NOT NULL, 
url VARCHAR(300),
description VARCHAR(600),
category_id INT NOT NULL REFERENCES categories ON DELETE RESTRICT
```
## `orders` table

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

## `order_items` table

columns:
```sql
id SERIAL PRIMARY KEY,
order_id INT NOT NULL REFERENCES orders ON DELETE RESTRICT,
product_id INT NOT NULL REFERENCES products ON DELETE RESTRICT,
quantity INT NOT NULL
```