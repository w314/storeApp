CREATE TABLE order_products (
  order_id INT,
  product_id INT,
  quantity INT,
  CONSTRAINT fk_order
    FOREIGN KEY(order_id)
      REFERENCES orders(order_id)
      ON DELETE SET NULL,
  CONSTRAINT fk_product
    FOREIGN KEY(product_id)
      REFERENCES products(product_id)
      ON DELETE SET NULL
);