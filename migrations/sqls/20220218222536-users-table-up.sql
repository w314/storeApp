/* Replace with your SQL commands */
CREATE TYPE usertype AS ENUM ('admin', 'regular');
CREATE TABLE users (
    username VARCHAR(100) UNIQUE,
    firstname VARCHAR(100), 
    lastname VARCHAR(100), 
    password_digest VARCHAR, 
    id SERIAL PRIMARY KEY,
    user_type usertype
);
