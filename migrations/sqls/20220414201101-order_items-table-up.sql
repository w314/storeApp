CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders ON DELETE RESTRICT,
  product_id INT NOT NULL REFERENCES products ON DELETE RESTRICT,
  quantity INT NOT NULL
);