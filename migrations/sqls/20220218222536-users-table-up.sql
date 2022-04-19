/* Replace with your SQL commands */
CREATE TYPE usertype AS ENUM ('admin', 'regular');
CREATE TABLE users (
    username VARCHAR(100) UNIQUE,
    firstname VARCHAR(100) NOT NULL, 
    lastname VARCHAR(100) NOT NULL, 
    password_digest VARCHAR NOT NULL,
    user_id SERIAL PRIMARY KEY,
    user_type usertype NOT NULL
);
