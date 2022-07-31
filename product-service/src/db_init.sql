--DROP DATABASE bookshop4_db;
-- CREATE DATABASE bookshop4_db;


CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    image text,
    price integer CHECK (price >=0)
);

CREATE TABLE IF NOT EXISTS stocks (
    product_id uuid NOT NULL,
    count integer CHECK (count >=0),
    PRIMARY KEY(product_id),
    CONSTRAINT fk_product_id
      FOREIGN KEY(product_id)
	  REFERENCES products(id)
);

TRUNCATE TABLE stocks;
TRUNCATE TABLE products CASCADE;
--DROP TABLE products CASCADE;

--BEGIN TRANSACTION;
INSERT INTO products(title, description, image, price)
VALUES('The Last Wish','Book 1. Geralt the Witcher—revered and hated—holds the line against the monsters plaguing humanity in this collection of adventures...','https://images-na.ssl-images-amazon.com/images/I/41m6LKVv9kS._SX312_BO1,204,203,200_.jpg', 36),
      ('Sword of Destiny','Book 2. Geralt the Witcher—revered and hated—holds the line against the monsters plaguing humanity in this collection of adventures...', 'https://images-na.ssl-images-amazon.com/images/I/41rV10Py9FL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',30),
      ('Blood of Elves','Book 3. Geralt the Witcher—revered and hated—holds the line against the monsters plaguing humanity in this collection of adventures...', 'https://images-na.ssl-images-amazon.com/images/I/41okipM7gDL._SX318_BO1,204,203,200_.jpg',13);

--BEGIN TRANSACTION;
INSERT INTO stocks(product_id, count)
VALUES((SELECT id FROM products WHERE title = 'The Last Wish'),10),
      ((SELECT id FROM products WHERE title = 'Sword of Destiny'),25),
      ((SELECT id FROM products WHERE title = 'Blood of Elves'),18);