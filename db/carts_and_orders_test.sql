-- user cart query
SELECT carts.id, cart_items.product_id, products.name, cart_items.product_quantity, cart_items.product_price, cart_items.line_item_total_price
FROM carts, cart_items, products
WHERE carts.user_id = 1
  AND carts.order_date IS NULL
  AND carts.id = cart_items.cart_id
  AND products.id = cart_items.product_id
  
-- all carts query
SELECT carts.id, cart_items.product_id, products.name, cart_items.product_quantity, cart_items.product_price, cart_items.line_item_total_price
FROM carts, cart_items, products
WHERE carts.order_date IS NULL
  AND carts.id = cart_items.cart_id
  AND products.id = cart_items.product_id
  
-- same as above, but multiple join statments
SELECT carts.id, cart_items.product_id, products.name, cart_items.product_quantity, cart_items.product_price, cart_items.line_item_total_price
FROM carts
JOIN cart_items
ON carts.id = cart_items.cart_id
JOIN products
on cart_items.product_id = products.id
WHERE carts.user_id = 1
  AND carts.order_date IS NULL
  
-- user order query
SELECT orders.id AS order_id, cart_items.product_id, cart_items.product_quantity, 
			 cart_items.product_price, cart_items.line_item_total_price
  FROM orders
  JOIN cart_items
    ON cart_items.cart_id = orders.id
 WHERE orders.user_id = 1
 
-- all orders query
SELECT orders.id AS order_id, cart_items.product_id, cart_items.product_quantity, 
			 cart_items.product_price, cart_items.line_item_total_price
  FROM orders
  JOIN cart_items
    ON cart_items.cart_id = orders.id

-- order total price
SELECT orders.id AS order_id, SUM(cart_items.id) AS total_items, SUM(line_item_total_price) AS total_price
  FROM orders
  JOIN cart_items
    ON cart_items.cart_id = orders.id
 WHERE orders.user_id = 1
  GROUP BY orders.id