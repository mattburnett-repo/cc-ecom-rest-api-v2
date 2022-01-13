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

-- RUN CREATE SCRIPT USING FOLOWING LINE
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/createDatabase.sql

-- RUN THIS TO ADD MINIMAL TEST DATA
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/insertTestData.sql

-- HEROKU CLI, push database changes to prod
--      *** this pushes local version of db to heroku, so do locally creates / inserts before these two ***
-- 1). heroku pg:reset HEROKU_POSTGRESQL_ONYX --confirm e-commerce-rest-api-v2
-- 2). heroku pg:push codecademy_ecommerce_rest_api_v2 HEROKU_POSTGRESQL_ONYX --app e-commerce-rest-api-v2

BEGIN;

DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users_addresses;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS users_payments;

CREATE TABLE carts
(
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    name character varying(150),
    order_date date DEFAULT CURRENT_DATE
);

CREATE TABLE cart_items
(
    -- id SERIAL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL, 
    product_quantity integer NOT NULL,
    product_price numeric(6, 2) NOT NULL,
    line_item_total_price numeric(6, 2) NOT NULL,
    PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE orders
(
    id SERIAL PRIMARY KEY,
    user_id integer,
    cart_id integer,
    order_date date DEFAULT CURRENT_DATE,
    total_price numeric(6, 2)
);

CREATE TABLE products
(
    id SERIAL PRIMARY KEY,
    category_id         integer,
    name character varying(100) NOT NULL,
    description character varying(1000) NOT NULL,
    image_url character varying(250),
    price numeric(6, 2)
);

CREATE TABLE product_categories
(
    category_id     integer,
    description     character varying(200),
    PRIMARY KEY (category_id)
);

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    user_name character varying(50) COLLATE pg_catalog."default" NOT NULL UNIQUE,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL, -- very long because it's hashed in register
    email character varying(50),
    google_id character varying(100),
    google_display_name character varying(100),
    google_first_name character varying(100),
    google_last_name character varying(100),
    google_image character varying(250)
);

CREATE TABLE addresses
(
    id SERIAL PRIMARY KEY,
    first_name character varying(100),
    last_name character varying(100),
    address_1 character varying(100) NOT NULL,
    address_2 character varying(100),
    city character varying(100) NOT NULL,
    state_province character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    country character varying(100) NOT NULL
);

CREATE TABLE users_addresses
(
    id SERIAL,
    user_id integer,
    address_id integer,
    PRIMARY KEY (user_id, address_id)
);

CREATE TABLE payments
(
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    stripe_id character varying(100),
    created integer,
    payment_method character varying(100),
    receipt_url character varying(200),
    transaction_status character varying(50),    
    amount numeric(6, 2) NOT NULL
);

CREATE TABLE users_payments
(
    id SERIAL,
    user_id integer NOT NULL,
    payment_id integer NOT NULL,
    PRIMARY KEY (user_id, payment_id)
);

ALTER TABLE users_payments  
    ADD CONSTRAINT users_payments_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES users(id);

ALTER TABLE users_payments  
    ADD CONSTRAINT users_payments_payment_type_id_fkey FOREIGN KEY(payment_id)
    REFERENCES payments(id);

ALTER TABLE users_addresses
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id)
    REFERENCES users(id);

ALTER TABLE users_addresses
    ADD CONSTRAINT address_id_fkey FOREIGN KEY (address_id)
    REFERENCES addresses(id);

ALTER TABLE products    
    ADD CONSTRAINT category_id_fkey FOREIGN KEY (category_id)
    REFERENCES product_categories (category_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

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