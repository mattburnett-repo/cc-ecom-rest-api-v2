-- Database: codecademy_ecommerce_rest_api_v2

-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f -a ./db/createDatabase.sql

-- DROP DATABASE IF EXISTS codecademy_ecommerce_rest_api_v2;

-- CREATE DATABASE codecademy_ecommerce_rest_api_v2
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE = 'en_US.UTF-8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- RUN SCRIPT USING FOLOWING LINE
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/createDatabase.sql

-- HEROKU CLI
-- heroku pg:push codecademy_ecommerce_rest_api_v2 HEROKU_POSTGRESQL_ONYX --app damp-fjord-27458

BEGIN;

DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users;

CREATE TABLE carts
(
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    order_date date
);

CREATE TABLE cart_items
(
    id SERIAL PRIMARY KEY,
    cart_id integer NOT NULL,
    product_id integer NOT NULL, 
    product_quantity integer NOT NULL,
    product_price decimal NOT NULL,
    line_item_total_price decimal NOT NULL
);

CREATE TABLE orders
(
    id SERIAL PRIMARY KEY,
    user_id integer,
    cart_id integer,
    total_price decimal
);

CREATE TABLE products
(
    id SERIAL PRIMARY KEY,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    price decimal
);

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    user_name character varying(50) COLLATE pg_catalog."default" NOT NULL UNIQUE,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL -- very long because it's hashed in /register
);

COMMENT ON TABLE users
    IS 'users / customers';

ALTER TABLE cart_items   
    ADD CONSTRAINT cart_id_fkey FOREIGN KEY (cart_id)
    REFERENCES Carts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE orders
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id)
    REFERENCES Users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE orders
    ADD CONSTRAINT cart_id_fkey FOREIGN KEY (cart_id)
    REFERENCES Carts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

-- Insert test data
INSERT INTO users(user_name, password) VALUES ('username_01', 'password_01');
INSERT INTO users(user_name, password) VALUES ('username_02', 'password_02');
INSERT INTO users(user_name, password) VALUES ('username_03', 'password_03');

INSERT INTO products(name, description, price) VALUES ('product_name_01', 'product_desc_01', 1.00);
INSERT INTO products(name, description, price) VALUES ('product_name_02', 'product_desc_02', 2.00);
INSERT INTO products(name, description, price) VALUES ('product_name_03', 'product_desc_03', 3.00);

END;