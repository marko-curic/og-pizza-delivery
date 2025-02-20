import "./SalesTable.css";
import {Order} from "../model/order";
import React from "react";
import {Pizza} from "../model/pizza";

interface TableProps {
    orders: Order[];
}

function SalesTable({ orders }: TableProps) {
    const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 24.99), 0);

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Customer</th>
                    <th>Pizza Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order: Order, orderIndex) => (
                    <React.Fragment key={order.id}>
                        {order.pizzas.map((pizza: Pizza, index) => (
                            <tr key={`${order.id}-${index}`} className={orderIndex % 2 === 0 ? "coffee-row" : "beige-row"}>
                                {index === 0 && <td rowSpan={order.pizzas.length}>{order.customerName}</td>}
                                <td>{pizza.type}</td>
                                <td>{pizza.quantity}</td>
                                {index === 0 && <td rowSpan={order.pizzas.length}>{order.totalPrice || 24.99}</td>}
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={3} className="total-label">Total:</td>
                    <td className="total-value">{totalSales.toFixed(2)}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default SalesTable;
