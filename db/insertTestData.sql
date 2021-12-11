-- RUN CREATE SCRIPT USING FOLOWING LINE
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/createDatabase.sql

-- RUN THIS TO ADD MINIMAL TEST DATA
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/insertTestData.sql

-- Insert test data
INSERT INTO users(user_name, password, email) VALUES ('username_01', 'password_01', '1@1.com');
INSERT INTO users(user_name, password, email) VALUES ('username_02', 'password_02', '2@2.com');
INSERT INTO users(user_name, password, email) VALUES ('username_03', 'password_03', '3@3.com');

INSERT INTO products(name, description, image_url, price) VALUES ('product_name_01', 'product_desc_01', 'http://www.image.com/item/1', 1.00);
INSERT INTO products(name, description, image_url, price) VALUES ('product_name_02', 'product_desc_02', 'http://www.image.com/item/2', 2.00);
INSERT INTO products(name, description, image_url, price) VALUES ('product_name_03', 'product_desc_03', 'http://www.image.com/item/3', 3.00);

INSERT INTO carts(user_id) VALUES (1);
INSERT INTO cart_items(cart_id, product_id, product_quantity, product_price, line_item_total_price) VALUES (1, 1, 1, 1.00, 1.00);
INSERT INTO cart_items(cart_id, product_id, product_quantity, product_price, line_item_total_price) VALUES (1, 2, 2, 2.00, 4.00);
INSERT INTO cart_items(cart_id, product_id, product_quantity, product_price, line_item_total_price) VALUES (1, 3, 3, 3.00, 9.00);

INSERT INTO orders(user_id, cart_id) VALUES (1, 1);

SELECT '*** You now have three users, three products, one cart, and one order as basic test data ***' AS test_data_inserted;