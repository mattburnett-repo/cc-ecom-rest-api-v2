-- RUN CREATE SCRIPT USING FOLOWING LINE
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/createDatabase.sql

-- RUN THIS TO ADD MINIMAL TEST DATA (this file)
-- psql postgres -d codecademy_ecommerce_rest_api_v2 -f ./db/insertTestData.sql

-- Insert test data
INSERT INTO users(user_name, password, email) VALUES ('username_01', 'password_01', '1@1.com');
INSERT INTO users(user_name, password, email) VALUES ('username_02', 'password_02', '2@2.com');
INSERT INTO users(user_name, password, email) VALUES ('username_03', 'password_03', '3@3.com');

INSERT INTO product_categories (category_id, description) VALUES (1, 'Pets');
INSERT INTO product_categories (category_id, description) VALUES (2, 'Tech');
INSERT INTO product_categories (category_id, description) VALUES (3, 'Health');
INSERT INTO product_categories (category_id, description) VALUES (4, 'Auto');

--  pixabay.com/ open link in new window
-- pets 1-8
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('hedgehog', 1, 'product_desc_01', 'https://cdn.pixabay.com/photo/2014/10/01/10/44/hedgehog-468228_1280.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('maine coon cat', 1, 'prod desc 02', 'https://cdn.pixabay.com/photo/2015/03/27/13/16/maine-coon-694730_1280.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('bulldog', 1, 'prod desc 03', 'https://cdn.pixabay.com/photo/2015/11/17/13/13/bulldog-1047518_1280.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('bunny', 1, 'prod desc 04', 'https://cdn.pixabay.com/photo/2014/06/21/08/43/rabbit-373691_1280.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('caiman lizard', 1, 'prod desc 05', 'https://cdn.pixabay.com/photo/2021/09/17/10/55/caiman-lizard-6632344_1280.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('malamute dog', 1, 'prod desc 06', 'https://cdn.pixabay.com/photo/2018/05/07/10/48/husky-3380548_1280.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('kitten', 1, 'prod desc 07', 'https://cdn.pixabay.com/photo/2019/08/20/21/21/cat-4419763_1280.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('guines pig', 1, 'prod desc 08', 'https://cdn.pixabay.com/photo/2014/01/11/23/40/guinea-pig-242520_1280.jpg', 1.00);

-- tech 9-16
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('laptop', 2, 'prod desc 01', 'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762__340.jpg', 2.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('glowing cube', 2, 'prod desc 02', 'https://cdn.pixabay.com/photo/2017/07/10/23/45/cubes-2492010__340.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('vt headset', 2, 'prod desc 03', 'https://cdn.pixabay.com/photo/2018/06/07/16/49/vr-3460451__340.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('smart phone', 2, 'prod desc 04', 'https://cdn.pixabay.com/photo/2018/01/08/02/34/technology-3068617__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('motherboard', 2, 'prod desc 05', 'https://cdn.pixabay.com/photo/2013/12/22/15/30/motherboard-232515__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('monitor', 2, 'prod desc 06', 'https://cdn.pixabay.com/photo/2017/02/12/13/04/lcd-2059995__480.png', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('time travel space ship', 2, 'prod desc 07', 'https://cdn.pixabay.com/photo/2018/01/31/08/35/space-port-3120607__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('bit coin', 2, 'prod desc 08', 'https://cdn.pixabay.com/photo/2018/02/03/02/40/technology-3126814__480.jpg', 1.00);

-- health 17-25
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('cup of tea', 3, 'prod desc 01', 'https://cdn.pixabay.com/photo/2015/07/02/20/37/cup-829527__340.jpg', 3.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('free weights', 3, 'prod desc 02', 'https://cdn.pixabay.com/photo/2017/07/02/19/24/dumbbells-2465478__340.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('stress management kit', 3, 'prod desc 03', 'https://cdn.pixabay.com/photo/2015/07/30/14/36/hypertension-867855__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('vitamins', 3, 'prod desc 04', 'https://cdn.pixabay.com/photo/2012/04/10/17/40/vitamins-26622__480.png', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('vaccine', 3, 'prod desc 05', 'https://cdn.pixabay.com/photo/2021/04/10/00/51/vaccine-6165772__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('dental care', 3, 'prod desc 06', 'https://cdn.pixabay.com/photo/2018/03/01/16/43/toothbrush-3191097__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('tablets', 3, 'prod desc 07', 'https://cdn.pixabay.com/photo/2015/10/22/14/05/tablets-1001224__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('pandemic management kit', 3, 'prod desc 08', 'https://cdn.pixabay.com/photo/2020/11/01/17/53/coronavirus-5704493__480.png', 1.00);


-- auto 25-32
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('sleek car from the future', 4, 'prod desc 01', 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278__340.jpg', 4.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('sleek car from the past', 4, 'prod desc 02', 'https://cdn.pixabay.com/photo/2015/05/28/23/12/auto-788747__340.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('vintage car', 4, 'prod desc 03', 'https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726__340.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('cargo van', 4, 'prod desc 04', 'https://cdn.pixabay.com/photo/2012/04/25/00/52/minivan-41476__480.png', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('taxi cab', 4, 'prod desc 05', 'https://cdn.pixabay.com/photo/2014/07/13/19/45/edsel-ranger-392745__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('rickshaw', 4, 'prod desc 06', 'https://cdn.pixabay.com/photo/2017/03/20/08/05/rickshaw-2158447__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('race car', 4, 'prod desc 07', 'https://cdn.pixabay.com/photo/2016/03/26/22/32/fast-1281628__480.jpg', 1.00);
INSERT INTO products(name, category_id, description, image_url, price) VALUES ('pick up truck', 4, 'prod desc 08', 'https://cdn.pixabay.com/photo/2016/04/01/12/11/pickup-truck-1300585__340.png', 1.00);


INSERT INTO carts(user_id, name) VALUES (1, 'test cart 01');
INSERT INTO cart_items(cart_id, product_id, product_quantity, product_price, line_item_total_price) VALUES (1, 1, 1, 1.00, 1.00);
INSERT INTO cart_items(cart_id, product_id, product_quantity, product_price, line_item_total_price) VALUES (1, 2, 2, 2.00, 4.00);
INSERT INTO cart_items(cart_id, product_id, product_quantity, product_price, line_item_total_price) VALUES (1, 3, 3, 3.00, 9.00);
INSERT INTO cart_items(cart_id, product_id, product_quantity, product_price, line_item_total_price) VALUES (1, 4, 4, 4.00, 16.00);

INSERT INTO orders(user_id, cart_id) VALUES (1, 1);

SELECT '*** You now have three users, four product categories, 32 products, one cart, and one order as basic test data ***' AS test_data_inserted;