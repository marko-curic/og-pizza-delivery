import {useEffect, useState} from "react";
import {Order} from "../model/order";
import {fetchCompletedOrders} from "../api/ordersApi";
import "../order/Orders.css";
import SalesTable from "./SalesTable";
import Loader from "../loader/Loader";

function Sales() {
    const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompletedOrders().then(result => {
            setCompletedOrders(result);
            setLoading(false);
        });
    }, []);

    return (
        <div className="orders-container">
            {loading ? <Loader/> :
                <div className="orders-content">
                    <SalesTable orders={completedOrders}/>
                </div>
            }
        </div>
    );
}

export default Sales;
