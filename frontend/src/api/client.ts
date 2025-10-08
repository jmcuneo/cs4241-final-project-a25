const API_URL = "http://localhost:3000";

export async function getFoods() {
    const res = await fetch(`${API_URL}/foods`);
    if (!res.ok) throw new Error("Failed to fetch foods");
    return res.json();
}

export async function getMeals() {
    const res = await fetch(`${API_URL}/meals`);
    if (!res.ok) throw new Error("Failed to fetch meals");
    return res.json();
}

export async function getMeal(id: number) {
    const res = await fetch(`${API_URL}/meals/${id}`);
    if (!res.ok) throw new Error("Failed to fetch meal");
    return res.json();
}

export async function addMeal(meal: {
    userId?: number;
    date: string;
    items: { foodId: number; quantity: number }[];
}) {
    const res = await fetch(`${API_URL}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
    });
    if (!res.ok) throw new Error("Failed to add meal");
    return res.json();
}
