import "./App.css";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

function App() {
    const [foods, setFoods] = useState<any[]>([]);
    const [foodId, setFoodId] = useState<number>();
    const [quantity, setQuantity] = useState<number>(1);
    const [meals, setMeals] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/foods`)
            .then((res) => res.json())
            .then(setFoods)
            .catch((err) => console.error("Failed to fetch foods", err));
    }, []);

    const loadMeals = () => {
        fetch(`${API_URL}/meals`)
            .then((res) => res.json())
            .then(setMeals)
            .catch((err) => console.error("Failed to fetch meals", err));
    };

    useEffect(() => {
        loadMeals();
    }, []);

    async function handleAddMeal(e: React.FormEvent) {
        e.preventDefault();
        if (!foodId || quantity <= 0) return;

        const newMeal = {
            userId: 1,
            date: new Date().toISOString(),
            items: [{ foodId, quantity }],
        };

        const res = await fetch(`${API_URL}/meals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMeal),
        });

        if (res.ok) {
            await loadMeals();
            setQuantity(1);
            alert("Meal added ✅");
        } else {
            alert("Failed to add meal");
        }
    }

    const totals = meals.reduce(
        (acc, meal) => {
            meal.items.forEach((item: any) => {
                const f = item.food;
                acc.calories += f.calories * item.quantity;
                acc.protein += f.protein * item.quantity;
                acc.carbs += f.carbs * item.quantity;
                acc.fat += f.fat * item.quantity;
            });
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Nutrition Tracker</h1>

            <form onSubmit={handleAddMeal} className="space-y-2 mb-6">
                <label>
                    Food:
                    <select
                        value={foodId ?? ""}
                        onChange={(e) => setFoodId(Number(e.target.value))}
                    >
                        <option value="">Select a food</option>
                        {foods.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name} ({f.calories} kcal)
                            </option>
                        ))}
                    </select>
                </label>

                <br />

                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min={1}
                    />
                </label>

                <br />

                <button type="submit">Add Meal</button>
            </form>

            <h2 className="text-xl font-bold mb-2">Today's Totals</h2>
            <ul>
                <li>Calories: {totals.calories.toFixed(1)}</li>
                <li>Protein: {totals.protein.toFixed(1)}g</li>
                <li>Carbs: {totals.carbs.toFixed(1)}g</li>
                <li>Fat: {totals.fat.toFixed(1)}g</li>
            </ul>

            <h2 className="text-xl font-bold mt-6 mb-2">Meals Logged</h2>
            <ul>
                {meals.map((m) => (
                    <li key={m.id}>
                        {new Date(m.date).toLocaleString()} —{" "}
                        {m.items
                            .map(
                                (i: any) =>
                                    `${i.quantity}× ${i.food.name} (${i.food.calories} kcal)`
                            )
                            .join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
