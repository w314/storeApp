CREATE TYPE orderstatus AS ENUM ('active', 'completed');
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users ON DELETE RESTRICT,
  order_status orderstatus NOT NULL
);