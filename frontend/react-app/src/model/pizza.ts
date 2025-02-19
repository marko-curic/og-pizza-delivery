import {Order} from "./order";

export interface Pizza {
    id: number;
    type: PizzaType;
    size: PizzaSize;
    toppings: Topping[];
    extras: Extras[];
    order: Order;
    quantity: number;
}

export interface PizzaCreateRequest {
    type: PizzaType;
    size: PizzaSize;
    toppings: Topping[];
    extras: Extras[];
    quantity: number;
    order: Order;
}

export enum Extras {
    CHEESE = "CHEESE",
    GARLIC = "GARLIC",
    HOT_SAUCE = "HOT_SAUCE",
    OLIVE_OIL = "OLIVE_OIL"
}

export enum PizzaType {
    MARGHERITA = "MARGHERITA",
    PEPPERONI = "PEPPERONI",
    VEGGIE = "VEGGIE"
}

export enum PizzaSize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE"
}

export enum Topping {
    CHEESE = "CHEESE",
    PEPPER = "PEPPER",
    MUSHROOM = "MUSHROOM",
    ONION = "ONION",
    PEPPERONI = "PEPPERONI",
    TOMATO = "TOMATO"
}