import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Food {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface MealItem {
    quantity: number;
    food: Food;
}

interface Meal {
    id: number;
    date: string;
    items: MealItem[];
}

const API_URL = "http://localhost:3000";

export default function LandingPage() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/meals`)
            .then((res) => res.json())
            .then((data) => {
                setMeals(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch meals", err);
                setLoading(false);
            });
    }, []);

    const todayMeals = meals.filter((meal) => {
        const mealDate = new Date(meal.date);
        const now = new Date();
        return (
            mealDate.getDate() === now.getDate() &&
            mealDate.getMonth() === now.getMonth() &&
            mealDate.getFullYear() === now.getFullYear()
        );
    });

    const totals = todayMeals.reduce(
        (acc, meal) => {
            meal.items.forEach((i) => {
                if (!i.food) return;
                acc.calories += i.food.calories * i.quantity;
                acc.protein += i.food.protein * i.quantity;
                acc.carbs += i.food.carbs * i.quantity;
                acc.fat += i.food.fat * i.quantity;
            });
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-100 flex flex-col items-center justify-center text-gray-800 p-6">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 space-y-6 text-center">
                <h1 className="text-4xl font-extrabold text-green-600 mb-4">
                    Daily Nutrition Summary
                </h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            <p className="text-lg font-medium text-gray-700">
                                Total Calories:{" "}
                                <span className="text-orange-500 font-bold">
                  {Math.round(totals.calories)} kcal
                </span>
                            </p>

                            <div className="space-y-2 text-left">
                                {["protein", "carbs", "fat"].map((macro) => (
                                    <div key={macro}>
                                        <div className="flex justify-between text-sm">
                                            <span className="capitalize">{macro}</span>
                                            <span>
                        {Math.round(totals[macro as keyof typeof totals])}g
                      </span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-3 rounded">
                                            <div
                                                className={`h-3 rounded ${
                                                    macro === "protein"
                                                        ? "bg-blue-400"
                                                        : macro === "carbs"
                                                            ? "bg-green-400"
                                                            : "bg-pink-400"
                                                }`}
                                                style={{
                                                    width: `${Math.min(
                                                        (totals[macro as keyof typeof totals] / 200) * 100,
                                                        100
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <Link
                                to="/tracker"
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-transform hover:scale-105"
                            >
                                Go to Tracker
                            </Link>
                        </div>
                    </>
                )}
            </div>
            <p className="mt-6 text-sm text-gray-500">
                Showing totals for <b>today</b> only
            </p>
        </div>
    );
}
