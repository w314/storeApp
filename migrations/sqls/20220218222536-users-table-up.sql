/* Replace with your SQL commands */
CREATE TYPE usertype AS ENUM ('admin', 'regular');
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    firstname VARCHAR(100) NOT NULL, 
    lastname VARCHAR(100) NOT NULL, 
    password VARCHAR NOT NULL,
    user_type usertype NOT NULL
);