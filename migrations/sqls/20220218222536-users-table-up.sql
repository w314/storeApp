/* Replace with your SQL commands */
CREATE TABLE users (
    userName DISTINCT NOT NULL VARCHAR(100),
    firstName VARCHAR(100), 
    lastName VARCHAR(100), 
    pasword_digest VARCHAR, 
    id SERIAL PRIMARY KEY
);
