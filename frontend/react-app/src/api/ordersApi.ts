import {AxiosResponse} from "axios";
import {Order, OrderDraftRequest, OrderStatus} from "../model/order";
import api from "./api";
import {User} from "../model/user";

export const fetchActiveOrders = async (user: User | undefined) => {
    function isActiveStatus(status: OrderStatus) {
        const activeStatuses = [OrderStatus.PENDING, OrderStatus.IN_PROGRESS, OrderStatus.DELIVERING];
        return activeStatuses.includes(status);
    }

    try {
        const response = await api.get("/orders/allOrders");
        const orders = mapOrders(response);

        let activeOrders = orders.filter((order: Order) => isActiveStatus(order.status))
        if(user && user.role === "CUSTOMER") {
            activeOrders = activeOrders.filter(order => order.customerName === user.username);
        }
        return activeOrders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};

export const fetchDraftOrder = async (username: string | undefined): Promise<Order | null> => {
    try {
        const response = await api.get<Order>(`/orders/${username}/draft`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return null;
    }
};

export const fetchCompletedOrders = async () => {
    try {
        const response = await api.get("orders/sales");
        
        console.log(response.data);

        return mapOrders(response);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};

export const createDraftOrder = async (orderDraftRequest: OrderDraftRequest) => {
    try {
        const order = await api.post("orders/draft", orderDraftRequest);
        return order.data;
    } catch (error) {
        console.error(error);
    }
};

export const submitOrder = async (id: number) => {
    try {
        const order = await api.post(`orders/${id}/submit`);
        return order.data;
    } catch (error) {
        console.error(error);
    }
};

export const deleteOrder = async (id: number) => {
    try {
        await api.delete(`orders/${id}`);
    } catch (error) {
        console.log(error);
    }
}

export const updateOrderStatus = async (id: number, newStatus: OrderStatus)=> {
    try {
        await api.put(`/orders/${id}/status/update`, newStatus);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

const mapOrders = (response: AxiosResponse) => {
    const orders: Order[] = response.data.map((order: Order) => ({
        id: order.id,
        customerName: order.customerName,
        address: order.address,
        status: order.status as OrderStatus,
        totalPrice: order.totalPrice,
        pizzas: order.pizzas
    }));

    return orders;
}