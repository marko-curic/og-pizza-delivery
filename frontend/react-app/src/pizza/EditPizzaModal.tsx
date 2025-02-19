import React from "react";
import Select from "react-select";
import {Extras, Pizza, PizzaSize, Topping} from "../model/pizza";

interface EditPizzaProps {
    isOpen: boolean;
    selectedPizza: Pizza;
    availableSizes: PizzaSize[];
    availableToppings: Topping[];
    availableExtras: Extras[];
    setSelectedPizza: React.Dispatch<React.SetStateAction<Pizza | null>>;
    handleUpdatePizza: () => void;
    handleCloseDropdown: () => void;
}

const EditPizzaModal: React.FC<EditPizzaProps> = ({
                                                      isOpen,
                                                      selectedPizza,
                                                      availableSizes,
                                                      availableToppings,
                                                      availableExtras,
                                                      setSelectedPizza,
                                                      handleUpdatePizza,
                                                      handleCloseDropdown,
                                                  }) => {
    return (
        <div className={`pizza-dropdown ${isOpen ? "open" : ""}`}>
            <div className="fields-container">
                <div className="field">
                    <label>Size</label>
                    <select
                        value={selectedPizza.size}
                        onChange={(e) =>
                            setSelectedPizza({...selectedPizza, size: e.target.value as PizzaSize})
                        }
                    >
                        {availableSizes.map((sizeOption) => (
                            <option key={sizeOption} value={sizeOption}>
                                {sizeOption}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label>Quantity</label>
                    <input
                        type="number"
                        value={selectedPizza.quantity}
                        onChange={(e) =>
                            setSelectedPizza({...selectedPizza, quantity: Number(e.target.value)})
                        }
                        min="1"
                    />
                </div>

                <div className="field">
                    <label>Toppings</label>
                    <Select
                        isMulti
                        options={availableToppings.map((topping) => ({value: topping, label: topping}))}
                        value={selectedPizza.toppings.map((topping) => ({value: topping, label: topping}))}
                        onChange={(selectedOptions) =>
                            setSelectedPizza({
                                ...selectedPizza,
                                toppings: selectedOptions.map((option) => option.value as Topping),
                            })
                        }
                    />
                </div>

                <div className="field">
                    <label>Extras</label>
                    <Select
                        isMulti
                        options={availableExtras.map((extra) => ({value: extra, label: extra}))}
                        value={selectedPizza.extras.map((extra) => ({value: extra, label: extra}))}
                        onChange={(selectedOptions) =>
                            setSelectedPizza({
                                ...selectedPizza,
                                extras: selectedOptions.map((option) => option.value as Extras),
                            })
                        }
                    />
                </div>
            </div>

            <div>
                <button onClick={handleUpdatePizza}>Save</button>
                <button onClick={handleCloseDropdown}>Cancel</button>
            </div>
        </div>
    );
};

export default EditPizzaModal;
