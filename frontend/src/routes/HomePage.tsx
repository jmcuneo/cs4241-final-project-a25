import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getMeals } from "../api/client";

// API response structure for meals (different from frontend Meal type)
interface ApiMealItem {
  id: number;
  quantity: number;
  food: {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface ApiMeal {
  id: number;
  date: string;
  mealType?: string;
  items: ApiMealItem[];
}

export default function HomePage() {
  const [meals, setMeals] = useState<ApiMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await getMeals();
        setMeals(data);
      } catch (error) {
        console.error("Failed to fetch meals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
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
      meal.items?.forEach((item: ApiMealItem) => {
        acc.calories += item.food.calories * item.quantity;
        acc.protein += item.food.protein * item.quantity;
        acc.carbs += item.food.carbs * item.quantity;
        acc.fat += item.food.fat * item.quantity;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Daily Nutrition Summary
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Your nutrition overview for today
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">Loading nutrition data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Nutrition Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Calories
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(totals.calories)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">kcal today</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Protein</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(totals.protein)}g
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Carbs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(totals.carbs)}g
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fat</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(totals.fat)}g
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Meals Summary */}
            {todayMeals.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Today's Meals ({todayMeals.length})
                </h2>
                <div className="space-y-3">
                  {todayMeals.map((meal, index) => (
                    <div
                      key={meal.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {meal.items?.length || 0} item
                          {meal.items?.length !== 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(meal.date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {Math.round(
                            meal.items?.reduce(
                              (sum: number, item: ApiMealItem) =>
                                sum + item.food.calories * item.quantity,
                              0,
                            ) || 0,
                          )}{" "}
                          cal
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-600 mb-4">No meals logged for today</p>
                <Link
                  href="/meal"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Log Your First Meal
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/meal"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
              >
                Add New Meal
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
