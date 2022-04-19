/* Replace with your SQL commands */
CREATE TABLE products (
    name VARCHAR(100) NOT NULL, 
    price float NOT NULL, 
    product_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories ON DELETE RESTRICT
);
