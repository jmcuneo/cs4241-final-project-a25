import { useEffect, useState } from "react";
import { getFoods } from "../api/client";

export default function FoodsList() {
    const [foods, setFoods] = useState<any[]>([]);

    useEffect(() => {
        getFoods()
            .then(setFoods)
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Foods</h2>
            <ul>
                {foods.map((f) => (
                    <li key={f.id}>
                        {f.name} — {f.calories} kcal
                    </li>
                ))}
            </ul>
        </div>
    );
}
