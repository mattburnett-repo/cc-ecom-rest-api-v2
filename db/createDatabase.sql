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

--  ALTER TABLE public.users
--     OWNER to postgres;

-- *** SOME ERROR HINTSs
-- // ERRORS
-- // length: 208,
-- // severity: 'ERROR',
-- // code: '23505',
-- // detail: 'Key (user_name)=(asdf) already exists.',
-- // hint: undefined,
-- // position: undefined,
-- // internalPosition: undefined,
-- // internalQuery: undefined,
-- // where: undefined,
-- // schema: 'public',
-- // table: 'users',
-- // column: undefined,
-- // dataType: undefined,
-- // constraint: 'users_user_name_key',
-- // file: 'nbtinsert.c',
-- // line: '670',
-- // routine: '_bt_check_unique'

-- RUN SCRIPT USING FOLOWING LINE
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/createDatabase.sql

-- RUN THIS TO ADD MINIMAL TEST DATA
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/insertTestData.sql

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
    order_date date,
    total_price decimal
);

CREATE TABLE products
(
    id SERIAL PRIMARY KEY,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    image_url character varying(250),
    price decimal
);

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    user_name character varying(50) COLLATE pg_catalog."default" NOT NULL UNIQUE,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL, -- very long because it's hashed in /register
    email character varying(50)
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

SELECT '*** Run insertTestData.sql to add minimal test data ***' AS do_this_next;

END;