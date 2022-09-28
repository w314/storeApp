CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, 
    price float NOT NULL, 
    url VARCHAR(300),
    description VARCHAR(600),
    category_id INT NOT NULL REFERENCES categories ON DELETE RESTRICT
);