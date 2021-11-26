-- Database: codecademy_ecommerce_rest_api_v2

-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f -a ./db/createDatabase.sql

DROP DATABASE IF EXISTS codecademy_ecommerce_rest_api_v2;

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

BEGIN;

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
    id integer NOT NULL,
    user_id integer,
    total_price money,
    CONSTRAINT "Orders_pkey" PRIMARY KEY (id)
);

CREATE TABLE Products
(
    id integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    price money,
    CONSTRAINT "Products_pkey" PRIMARY KEY (id)
);

CREATE TABLE Users
(
    id integer NOT NULL,
    user_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(25) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY (id)
);

COMMENT ON TABLE Users
    IS 'users / customers';

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
INSERT INTO Users VALUES (1, 'username_01', 'password_01');
INSERT INTO Users VALUES (2, 'username_02', 'password_02');
INSERT INTO Users VALUES (3, 'username_03', 'password_03');

END;