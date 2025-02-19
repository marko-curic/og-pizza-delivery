import "./PizzaCard.css";
import {PizzaType} from "../model/pizza";

interface PizzaCardProps {
    type: PizzaType;
    onAdd: () => void;
}

function PizzaCard({type, onAdd}: PizzaCardProps) {
    return (
        <div className="pizza-card">
            <img src={`/images/${type.toLowerCase()}.jpg`} alt={type} className="pizza-image"/>
            <div className="pizza-info">
                <h3>{type}</h3>
                <div className="pizza-actions">
                    <button onClick={onAdd} className="add-to-cart-dropdown">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PizzaCard;
