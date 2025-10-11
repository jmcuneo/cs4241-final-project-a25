export async function checkAuth() {
  const res = await fetch("http://localhost:3000/api/user", {
    credentials: "include",
  });
  if (res.ok) {
    return res.json();
  }
  return null;
}

export async function getFoods() {
  const res = await fetch(`/api/foods`);
  if (!res.ok) throw new Error("Failed to fetch foods");
  return res.json();
}

export async function getMeals() {
  const res = await fetch(`/api/meals`);
  if (!res.ok) throw new Error("Failed to fetch meals");
  return res.json();
}

export async function getMeal(id: number) {
  const res = await fetch(`/api/meals/${id}`);
  if (!res.ok) throw new Error("Failed to fetch meal");
  return res.json();
}

export async function getMealsByDate(
  userId?: number,
  startDate?: string,
  endDate?: string,
) {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId.toString());
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const res = await fetch(`/api/meals/by-date?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch meals by date");
  return res.json();
}

export async function addMeal(meal: {
  userId?: number;
  date: string;
  mealType?: string;
  items: {
    foodId: number;
    quantity: number;
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}) {
  const res = await fetch(`/api/meals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  });
  if (!res.ok) throw new Error("Failed to add meal");
  return res.json();
}

export async function addFood(food: {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}) {
  const res = await fetch(`/api/foods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(food),
  });
  if (!res.ok) throw new Error("Failed to add food");
  return res.json();
}

export async function searchFoods(query: string) {
  const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search foods");
  return res.json();
}

export async function getFoodDetails(fdcId: number) {
  const res = await fetch(`/api/foods/${fdcId}`);
  if (!res.ok) throw new Error("Failed to fetch food details");
  return res.json();
}
