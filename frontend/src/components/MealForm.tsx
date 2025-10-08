import { useState } from "react";
import { addMeal } from "../api/client";

export default function MealForm() {
    const [foodId, setFoodId] = useState(1);
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const meal = await addMeal({
                userId: 1,
                date: new Date().toISOString(),
                items: [{ foodId, quantity }],
            });
            console.log("Meal added:", meal);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <h2 className="text-xl font-bold">Add Meal</h2>
            <label>
                Food ID:{" "}
                <input
                    type="number"
                    value={foodId}
                    onChange={(e) => setFoodId(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Quantity:{" "}
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
            </label>
            <br />
            <button type="submit">Add Meal</button>
        </form>
    );
}
