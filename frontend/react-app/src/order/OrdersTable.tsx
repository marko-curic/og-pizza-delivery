import React, {useContext, useState} from "react";
import {Order, OrderStatus} from "../model/order";
import {updateOrderStatus} from "../api/ordersApi";
import {Extras, Pizza, PizzaSize, Topping} from "../model/pizza";
import {AuthContext} from "../context/AuthContext";
import "./OrdersTable.css"
import EditPizzaModal from "../pizza/EditPizzaModal";
import {updatePizza} from "../api/pizzaApi";

interface TableProps {
    orders: Order[];
    onOrderRemoved: () => void;
}

function OrdersTable({orders, onOrderRemoved}: TableProps) {
    const authContext = useContext(AuthContext);
    const [isEditEnabled, setIsEditEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedOrders, setUpdatedOrders] = useState(orders);
    const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
    const availableStatuses: OrderStatus[] = Object.values(OrderStatus).filter(status => status !== OrderStatus.DRAFT);

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            const newOrders = updateOrderInState(updatedOrders, orderId, newStatus);
            setUpdatedOrders(newOrders);

            if (newOrders.length === 0) {
                onOrderRemoved();
            }
        } catch (error) {
            console.error('Failed to update order status', error);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            await updateOrderStatus(orderId, OrderStatus.CANCELED);
            const newOrders = updateOrderInState(updatedOrders, orderId, OrderStatus.CANCELED);
            setUpdatedOrders(newOrders);

            if (newOrders.length === 0) {
                onOrderRemoved();
            }
        } catch (error) {
            console.error('Failed to update order status', error);
        }
    };

    const updateOrderInState = (orders: Order[], orderId: number, newStatus: OrderStatus) => {
        return newStatus === OrderStatus.COMPLETED || OrderStatus.CANCELED
            ? orders.filter(order => order.id !== orderId)
            : orders.map(order => (order.id === orderId ? {...order, status: newStatus} : order));
    };

    const handleOpenEditModal = (pizza: Pizza) => {
        setSelectedPizza(pizza);
        setIsEditEnabled(true);
        setIsModalOpen(true);
    }

    function handleCloseDropdown() {
        setSelectedPizza(null);
        setIsModalOpen(false);
    }

    const handleUpdatePizza = async () => {
        if (!selectedPizza) return;
        await updatePizza(selectedPizza.id, selectedPizza.size, selectedPizza.quantity, selectedPizza.toppings, selectedPizza.extras);
        setSelectedPizza(null);
    };

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Pizza Type</th>
                    <th>Toppings</th>
                    <th>Extras</th>
                    <th>Quantity</th>
                    {authContext?.user?.role === "CUSTOMER" && <th></th>}
                </tr>
                </thead>
                <tbody>
                {updatedOrders.map((order: Order, orderIndex) => (
                    <React.Fragment key={order.id}>
                        {order.pizzas.map((pizza: Pizza, index) => (
                            <tr key={`${order.id}-${index}`}
                                className={orderIndex % 2 === 0 ? "coffee-row" : "beige-row"}>
                                {index === 0 &&
                                    <td rowSpan={order.pizzas.length}>{order.customerName}</td>}
                                {index === 0 && (
                                    <td rowSpan={order.pizzas.length}>
                                        <select
                                            disabled={authContext?.user?.role === "CUSTOMER"}
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                        >
                                            {availableStatuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                )}
                                <td>{pizza.type}</td>
                                <td>{pizza.toppings.length > 0 ? pizza.toppings.join(", ") : "-"}</td>
                                <td>{pizza.extras.join(", ")}</td>
                                <td>{pizza.quantity}</td>
                                {authContext?.user?.role === "CUSTOMER" &&
                                    <td>
                                        <button className="remove-button"
                                                onClick={() => handleCancelOrder(order.id)}>Remove
                                        </button>
                                        <button className="edit-button"
                                                onClick={() => handleOpenEditModal(pizza)}>Edit
                                        </button>
                                        {isEditEnabled && selectedPizza && selectedPizza.id === pizza.id && (
                                            <EditPizzaModal
                                                isOpen={isModalOpen}
                                                selectedPizza={selectedPizza}
                                                availableSizes={Object.values(PizzaSize)}
                                                availableToppings={Object.values(Topping)}
                                                availableExtras={Object.values(Extras)}
                                                setSelectedPizza={setSelectedPizza}
                                                handleUpdatePizza={handleUpdatePizza}
                                                handleCloseDropdown={handleCloseDropdown}
                                            />
                                        )}

                                    </td>}
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrdersTable;
