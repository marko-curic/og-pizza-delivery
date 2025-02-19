CREATE TABLE orders
(
    id            BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(50) NOT NULL,
    address       TEXT        NOT NULL,
    status        VARCHAR(50) NOT NULL,
    created_at    TIMESTAMP,
    updated_at    TIMESTAMP
);

CREATE TABLE pizzas
(
    id          BIGSERIAL PRIMARY KEY,
    type        VARCHAR(50) NOT NULL,
    size        VARCHAR(50) NOT NULL,
    order_id    BIGINT NOT NULL,
    quantity    INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

CREATE TABLE pizza_toppings
(
    pizza_id   BIGINT NOT NULL,
    toppings   VARCHAR(50) NOT NULL,
    PRIMARY KEY (pizza_id, toppings),
    FOREIGN KEY (pizza_id) REFERENCES pizzas (id) ON DELETE CASCADE
);

CREATE TABLE pizza_extras
(
    pizza_id   BIGINT NOT NULL,
    extras      VARCHAR(50) NOT NULL,
    PRIMARY KEY (pizza_id, extras),
    FOREIGN KEY (pizza_id) REFERENCES pizzas (id) ON DELETE CASCADE
);

CREATE TABLE extras
(
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
