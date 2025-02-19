import {useContext, useEffect, useState} from "react";
import "./PizzaMenu.css";
import "./PizzaDropdown.css";
import Loader from "../loader/Loader";
import PizzaCard from "./PizzaCard";
import {createPizza} from "../api/pizzaApi";
import {Extras, Pizza, PizzaCreateRequest, PizzaSize, PizzaType, Topping} from "../model/pizza";
import {OrderDraftRequest} from "../model/order";
import {AuthContext} from "../context/AuthContext";
import {createDraftOrder} from "../api/ordersApi";
import Select from "react-select";

interface CartItem {
    id: number;
    quantity: number;
    size: PizzaSize;
}

const availableToppings = Object.values(Topping);
const availableExtras = Object.values(Extras);
const availableSizes = Object.values(PizzaSize);

function PizzaMenu() {
    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<{ [key: number]: CartItem }>({});
    const [selectedPizza, setSelectedPizza] = useState<PizzaType | null>(null);
    const [size, setSize] = useState<PizzaSize>(PizzaSize.SMALL);
    const [quantity, setQuantity] = useState<number>(1);
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [extras, setExtras] = useState<Extras[]>([]);

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleOpenDropdown = (type: PizzaType) => {
        setSelectedPizza(type);
    };

    const handleCloseDropdown = () => {
        setSelectedPizza(null);
        setToppings([]);
        setExtras([]);
        setSize(PizzaSize.SMALL);
        setQuantity(1);
    };

    const handleConfirmPizza = async () => {
        if (!size) {
            return;
        }

        const orderSubmitRequest: OrderDraftRequest = {
            username: authContext!!.user!!.username,
            address: authContext!!.user!!.address,
            pizzas: []
        };

        const order = await createDraftOrder(orderSubmitRequest);

        if (order === undefined) {
            throw new Error("There was a problem creating your order.");
        }

        const pizzaCreateRequest: PizzaCreateRequest = {
            type: selectedPizza!,
            size: size,
            toppings: toppings,
            extras: extras,
            quantity: quantity,
            order: order
        };

        const pizza: Pizza = await createPizza(pizzaCreateRequest);
        setCart(prevCart => ({
            ...prevCart,
            [pizza.id]: {
                id: pizza.id,
                quantity,
                size,
            },
        }));
        handleCloseDropdown();
    };

    return (
        <div className="pizza-container">
            <div className="pizza-content">
                {loading ? (
                    <Loader/>
                ) : (
                    <div className="pizza-grid">
                        {Object.values(PizzaType).map((type: PizzaType) => (
                            <PizzaCard
                                key={type}
                                type={type}
                                onAdd={() => handleOpenDropdown(type)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedPizza && (
                <div className={`pizza-dropdown ${selectedPizza ? 'open' : ''}`}>
                    <h3>{selectedPizza}</h3>
                    <div className="fields-container">
                        <div className="field">
                            <label>Size</label>
                            <select
                                value={size}
                                onChange={(e) =>
                                    setSize(e.target.value as PizzaSize)
                                }
                            >
                                {availableSizes.map((sizeOption) => (
                                    <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label>Quantity</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                }
                                min="1"
                            />
                        </div>

                        <div className="field">
                            <label>Toppings</label>
                            <Select
                                isMulti
                                options={availableToppings.map(topping => ({ value: topping, label: topping }))}
                                value={toppings.map(topping => ({ value: topping, label: topping }))}
                                onChange={(selectedOptions) =>
                                    setToppings(selectedOptions.map(option => option.value as Topping))
                                    }
                            />
                        </div>

                        <div className="field">
                            <label>Extras</label>
                            <Select
                                isMulti
                                options={availableExtras.map(extra => ({ value: extra, label: extra }))}
                                value={extras.map(extra => ({ value: extra, label: extra }))}
                                onChange={(selectedOptions) =>
                                    setExtras(selectedOptions.map(option => option.value as Extras))
                                    }
                            />
                        </div>
                    </div>

                    <div>
                        <button onClick={handleConfirmPizza}>Add to Cart</button>
                        <button onClick={handleCloseDropdown}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PizzaMenu;
