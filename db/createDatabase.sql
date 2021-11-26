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

-- COMMENT ON DATABASE codecademy_ecommerce_rest_api_v2
--     IS 'database for the ecom / rest project';

-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.

-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/createDatabase.sql

BEGIN;

DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE Carts
(
    id integer PRIMARY KEY,
    user_id integer NOT NULL,
    cart_id integer NOT NULL, 
    order_date date
);

CREATE TABLE Cart
(
    id SERIAL PRIMARY KEY,
    product_id integer NOT NULL, 
    product_name character varying,
    product_quantity integer NOT NULL,
    line_item_total_price money NOT NULL
);

CREATE TABLE Order_Item
(
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    line_item_price money,
    product_quantity integer
);

CREATE TABLE Orders
(
    id integer PRIMARY KEY,
    user_id integer,
    total_price money
);

CREATE TABLE Products
(
    id SERIAL PRIMARY KEY,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    price money
);

CREATE TABLE Users
(
    id SERIAL PRIMARY KEY,
    user_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(25) COLLATE pg_catalog."default" NOT NULL
);

COMMENT ON TABLE Users
    IS 'users / customers';

ALTER TABLE Carts   
    ADD CONSTRAINT cart_id_fkey FOREIGN KEY (cart_id)
    REFERENCES Cart (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE Cart
    ADD CONSTRAINT product_id_fkey FOREIGN KEY (product_id)
    REFERENCES Products (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE Order_Item
    ADD CONSTRAINT order_id_fkey FOREIGN KEY (order_id)
    REFERENCES Orders (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE Order_Item
    ADD CONSTRAINT product_id_fkey FOREIGN KEY (product_id)
    REFERENCES Products (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE Orders
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id)
    REFERENCES Users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

-- Insert test data
INSERT INTO Users(user_name, password) VALUES ('username_01', 'password_01');
INSERT INTO Users(user_name, password) VALUES ('username_02', 'password_02');
INSERT INTO Users(user_name, password) VALUES ('username_03', 'password_03');

INSERT INTO Products(name, description, price) VALUES ('product_name_01', 'product_desc_01', 1.00);
INSERT INTO Products(name, description, price) VALUES ('product_name_02', 'product_desc_02', 2.00);
INSERT INTO Products(name, description, price) VALUES ('product_name_03', 'product_desc_03', 3.00);

END;