import {useContext, useEffect, useState} from "react";
import Loader from "../loader/Loader";
import "./Cart.css";
import "./PizzaDropdown.css";
import {CartItem} from "../model/cart";
import {deleteOrder, fetchDraftOrder, submitOrder} from "../api/ordersApi";
import {AuthContext} from "../context/AuthContext";
import {Extras, Pizza, PizzaSize, Topping} from "../model/pizza";
import {removeFromCart, updatePizza} from "../api/pizzaApi";
import EditPizzaModal from "./EditPizzaModal";

function Cart() {
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
    const authContext = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const availableToppings = Object.values(Topping);
    const availableExtras = Object.values(Extras);
    const availableSizes = Object.values(PizzaSize);

    useEffect(() => {
        fetchDraftOrder(authContext?.user?.username).then(result => {
            try {
                if (result) {
                    const cartItems: CartItem[] = result.pizzas.map((pizza: Pizza) => ({
                        id: pizza.id,
                        pizza: pizza
                    }));
                    setCart(cartItems);
                } else {
                    setCart([]);
                }
            } catch (error) {
                setCart([]);
            } finally {
                setLoading(false);
            }
        });
    }, []);

    const handleRemoveItem = async (itemId: number) => {
        await removeFromCart(itemId);
        setCart(cart.filter(item => item.id !== itemId));
    };

    const handleSubmit = async () => {
        const draft = await fetchDraftOrder(authContext?.user?.username);
        if (draft === null) {
            throw new Error("You cannot submit an order that is not in DRAFT status.");
        } else {
            await submitOrder(draft.id);
            setCart([]);
        }
    };

    const handleEmptyCart = async () => {
        const draft = await fetchDraftOrder(authContext?.user?.username);
        if (draft === null) {
            throw new Error("You cannot empty an order that is not in DRAFT status.");
        } else {
            await deleteOrder(draft.id);
            setCart([]);
        }
    };

    const handleOpenEditModal = (pizza: Pizza) => {
        if (selectedPizza === pizza) {
            setSelectedPizza(null);
        } else {
            setSelectedPizza(pizza);
            setIsModalOpen(true);
        }
    };

    function handleCloseDropdown() {
        setSelectedPizza(null);
        setIsModalOpen(false);
    }

    const handleUpdatePizza = async () => {
        if (!selectedPizza) return;
        await updatePizza(selectedPizza.id, selectedPizza.size, selectedPizza.quantity, selectedPizza.toppings, selectedPizza.extras);
        setCart(cart.map(item =>
            item.pizza.id === selectedPizza.id
                ? {...item, pizza: selectedPizza}
                : item
        ));
        setSelectedPizza(null);
    };

    return (
        <div className="cart-container">
            <div className="cart-content">
                {loading ? (
                    <Loader/>
                ) : cart.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                ) : (
                    <table className="cart-table">
                        <thead>
                        <tr>
                            <th>Pizza</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Toppings</th>
                            <th>Extras</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart.map(item => (
                            <tr key={item.id}>
                                <td>{item.pizza.type}</td>
                                <td>{item.pizza.size}</td>
                                <td>{item.pizza.quantity}</td>
                                <td>{item.pizza.toppings.join(", ")}</td>
                                <td>{item.pizza.extras.join(", ")}</td>
                                <td>
                                    <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>Remove
                                    </button>
                                    <button className="edit-button"
                                            onClick={() => handleOpenEditModal(item.pizza)}>Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {selectedPizza && (
                    <EditPizzaModal
                        isOpen={isModalOpen}
                        selectedPizza={selectedPizza}
                        availableSizes={availableSizes}
                        availableToppings={availableToppings}
                        availableExtras={availableExtras}
                        setSelectedPizza={setSelectedPizza}
                        handleUpdatePizza={handleUpdatePizza}
                        handleCloseDropdown={handleCloseDropdown}
                    />
                )}
                {cart.length > 0 && (
                    <div>
                        <button className="submit-order-button" onClick={handleSubmit}>Submit Order</button>
                        <button className="empty-cart-button" onClick={handleEmptyCart}>Empty Cart</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
