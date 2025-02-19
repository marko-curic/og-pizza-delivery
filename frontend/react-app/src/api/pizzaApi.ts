import {Extras, PizzaCreateRequest, PizzaSize, Topping} from "../model/pizza";
import api from "./api";

export const fetchMenu = async () => {
    try {
        const response = await api.get("/pizza/menu");

        return response.data;
    } catch (error) {
        console.error("Error fetching pizzas:", error);
        return [];
    }
};

export const fetchPizza = async (id: number) => {
    try {
        const response = await api.get(`/pizza/${id}`);

        return response.data;
    } catch (error) {
        console.error(`Error fetching pizza with id: ${id}`, error);
        return {};
    }
};

export const createPizza = async (pizza: PizzaCreateRequest) => {
    try {
        const response = await api.post(`/pizza/create`, pizza);

        return response.data;
    } catch (error) {
        console.error(`Error creating pizza`, error);
        return {};
    }
};

export const removeFromCart = async (id: number) => {
    try {
        await api.delete(`/pizza/${id}`)
    } catch (error) {
        console.log("Unable to remove item from cart.")
    }
}

export const updatePizza =
    async (id: number, size: PizzaSize, quantity: number, toppings: Topping[], extras: Extras[])=> {
    const response = await api.put(`/pizza/${id}`, {
        size: size,
        quantity: quantity,
        toppings: toppings,
        extras: extras
    });

    return response.data;
}