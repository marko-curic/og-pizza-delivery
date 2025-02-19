import OrdersTable from "./OrdersTable";
import Loader from "../loader/Loader";
import {useContext, useEffect, useState} from "react";
import {fetchActiveOrders} from "../api/ordersApi";
import {Order} from "../model/order";
import {AuthContext} from "../context/AuthContext";

function Orders() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [hasOrders, setHasOrders] = useState(false);
    const user = useContext(AuthContext)?.user;

    useEffect(() => {
        fetchActiveOrders(user).then(result => {
            setOrders(result);
            setLoading(false);
            setHasOrders(result.length > 0);
        });
    }, [user]);

    const handleOrderRemoved = () => {
        setHasOrders(false);
    };

    return (
        <div className="orders-container">
            {loading ? (
                <Loader/>
            ) : (
                <div className="orders-content">
                    {hasOrders ? (
                        <OrdersTable orders={orders} onOrderRemoved={handleOrderRemoved}/>
                    ) : (
                        <p className="empty-table">No active orders.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Orders;
