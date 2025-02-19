-- Insert sample pizzas
INSERT INTO pizzas (type, size) VALUES
                                    ('MARGHERITA', 'MEDIUM'),
                                    ('PEPPERONI', 'LARGE'),
                                    ('VEGGIE', 'SMALL'),
                                    ('PEPPERONI', 'MEDIUM'),
                                    ('PEPPERONI', 'LARGE');

-- Insert sample toppings
INSERT INTO toppings (name) VALUES
                                ('Mushrooms'),
                                ('Olives'),
                                ('Peppers'),
                                ('Onions'),
                                ('Bacon');

-- Insert sample extras
INSERT INTO extras (name) VALUES
                              ('Extra Cheese'),
                              ('Garlic Sauce'),
                              ('Ranch Dressing');

-- Insert sample orders
INSERT INTO orders (customer_name, address, status, created_at, updated_at) VALUES
                                                                                ('Alice Johnson', '123 Main St', 'CANCELED', NOW(), NOW()),
                                                                                ('Bob Smith', '456 Oak St', 'IN_PROGRESS', NOW(), NOW()),
                                                                                ('Charlie Davis', '789 Pine St', 'IN_PROGRESS', NOW(), NOW()),
                                                                                ('David Lee', '321 Maple St', 'IN_PROGRESS', NOW(), NOW()),
                                                                                ('Emma Wilson', '654 Birch St', 'IN_PROGRESS', NOW(), NOW()),
                                                                                ('Fiona Brown', '987 Cedar St', 'IN_PROGRESS', NOW(), NOW()),
                                                                                ('George White', '159 Elm St', 'DELIVERING', NOW(), NOW()),
                                                                                ('Hannah Adams', '753 Walnut St', 'PENDING', NOW(), NOW()),
                                                                                ('Isaac Green', '852 Spruce St', 'COMPLETED', NOW(), NOW()),
                                                                                ('Jack Martin', '951 Redwood St', 'COMPLETED', NOW(), NOW());

-- Insert partial orders linking orders with pizzas
INSERT INTO partial_orders (order_id, pizza_id, quantity) VALUES
                                                              (1, 1, 2),
                                                              (2, 2, 1),
                                                              (3, 3, 3),
                                                              (4, 4, 2),
                                                              (5, 5, 1),
                                                              (6, 1, 2),
                                                              (7, 2, 3),
                                                              (8, 3, 1),
                                                              (9, 4, 2),
                                                              (10, 5, 1);

-- Insert pizza toppings
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
                                                      (1, 1), (1, 2),
                                                      (2, 3),
                                                      (3, 4),
                                                      (4, 5),
                                                      (5, 1),
                                                      (2, 5);

-- Insert pizza extras
INSERT INTO pizza_extras (pizza_id, extra_id) VALUES
                                                  (1, 1),
                                                  (2, 2),
                                                  (3, 3),
                                                  (4, 1),
                                                  (5, 2);
