import {Pizza} from "./pizza";

export interface Order {
    id: number;
    customerName: string;
    address: string;
    pizzas: Pizza[];
    status: OrderStatus;
    totalPrice: number;
}

export interface OrderDraftRequest {
    username: string;
    address: string;
    pizzas: Pizza[];
}

export enum OrderStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    DELIVERING = "DELIVERING",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED"
}