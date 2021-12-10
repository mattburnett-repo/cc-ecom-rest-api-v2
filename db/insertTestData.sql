-- Insert test data
INSERT INTO users(user_name, password, email) VALUES ('username_01', 'password_01', '1@1.com');
INSERT INTO users(user_name, password, email) VALUES ('username_02', 'password_02', '2@2.com');
INSERT INTO users(user_name, password, email) VALUES ('username_03', 'password_03', '3@3.com');

INSERT INTO products(name, description, image_url, price) VALUES ('product_name_01', 'product_desc_01', 'http://www.image.com/item/1', 1.00);
INSERT INTO products(name, description, image_url, price) VALUES ('product_name_02', 'product_desc_02', 'http://www.image.com/item/2', 2.00);
INSERT INTO products(name, description, image_url, price) VALUES ('product_name_03', 'product_desc_03', 'http://www.image.com/item/3', 3.00);

INSERT INTO carts(user_id) VALUES (1);

INSERT INTO orders(user_id, cart_id) VALUES (1, 1);

SELECT '*** You now have three users, three products, one cart, and one order as basic test data ***' AS test_data_inserted;