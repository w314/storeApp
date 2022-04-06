/* Replace with your SQL commands */
CREATE TABLE products (
    name VARCHAR(100), 
    price float, 
    product_id SERIAL PRIMARY KEY,
    category_id INT,
    CONSTRAINT fk_category
        FOREIGN KEY(category_id)
            REFERENCES categories(category_id)
            ON DELETE SET NULL
);
