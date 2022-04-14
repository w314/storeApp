CREATE TYPE ordertype AS ENUM ('active', 'completed');
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT,
  order_type ordertype,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES users(user_id)
      ON DELETE SET NULL
);