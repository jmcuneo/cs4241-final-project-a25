import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getMealsByDate } from "../api/client";
import type { DayData } from "../types/api";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchMealsForDate = async () => {
      setLoading(true);
      try {
        // Fetch meals for selected date
        const data = await getMealsByDate(
          undefined,
          selectedDate,
          selectedDate,
        );

        // The API returns an array of day data, we want the selected date's data
        if (data && data.length > 0) {
          setDayData(data[0]);
        } else {
          // No meals for selected date
          setDayData({
            date: selectedDate,
            meals: [],
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch meals", error);
        // Set empty data on error
        setDayData({
          date: selectedDate,
          meals: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMealsForDate();
  }, [selectedDate]);

  const totals = dayData
    ? {
        calories: dayData.totalCalories,
        protein: dayData.totalProtein,
        carbs: dayData.totalCarbs,
        fat: dayData.totalFat,
      }
    : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const meals = dayData?.meals || [];

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
    setExpandedMeals(new Set()); // Reset expanded meals when changing dates
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  // Fix timezone issue by creating date with explicit time
  const selectedDateObj = new Date(selectedDate + "T12:00:00.000Z");
  const formattedDate = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const toggleMealExpansion = (mealId: number) => {
    const newExpanded = new Set(expandedMeals);
    if (newExpanded.has(mealId)) {
      newExpanded.delete(mealId);
    } else {
      newExpanded.add(mealId);
    }
    setExpandedMeals(newExpanded);
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Daily Nutrition Summary
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isToday
                ? "Your nutrition overview for today"
                : `Nutrition overview for ${formattedDate}`}
            </p>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          <button
            onClick={() => navigateDate("prev")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Previous day"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setExpandedMeals(new Set());
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {!isToday && (
              <button
                onClick={() => {
                  setSelectedDate(new Date().toISOString().split("T")[0]);
                  setExpandedMeals(new Set());
                }}
                className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                Today
              </button>
            )}
          </div>

          <button
            onClick={() => navigateDate("next")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Next day"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
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
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {isToday ? "kcal today" : "kcal this day"}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Protein</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(totals.protein)}g
                    </p>
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
                </div>
              </div>
            </div>

            {/* Meals Summary */}
            {meals.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {isToday
                    ? `Today's Meals (${meals.length})`
                    : `Meals for ${selectedDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} (${meals.length})`}
                </h2>
                <div className="space-y-3">
                  {meals.map((meal, index) => {
                    const isExpanded = expandedMeals.has(meal.id || index);
                    return (
                      <div
                        key={meal.id || index}
                        className="bg-gray-50 rounded-md overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => toggleMealExpansion(meal.id || index)}
                        >
                          <div className="flex items-center space-x-3">
                            <svg
                              className={`w-4 h-4 text-gray-500 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">
                                {meal.mealType || "Meal"} -{" "}
                                {meal.items?.length || 0} item
                                {meal.items?.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {Math.round(
                                meal.calculatedNutrition?.calories || 0,
                              )}{" "}
                              cal
                            </p>
                            <p className="text-xs text-gray-500">
                              P:{" "}
                              {Math.round(
                                meal.calculatedNutrition?.protein || 0,
                              )}
                              g | C:{" "}
                              {Math.round(meal.calculatedNutrition?.carbs || 0)}
                              g | F:{" "}
                              {Math.round(meal.calculatedNutrition?.fat || 0)}g
                            </p>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-white">
                            <div className="p-4 space-y-3">
                              {meal.items?.map((item, itemIndex) => (
                                <div
                                  key={item.id || itemIndex}
                                  className="flex items-center justify-between p-3 border border-gray-100 rounded-md bg-gray-25"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {item.food.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm">
                                    <p className="font-medium text-gray-900">
                                      {Math.round(
                                        item.food.calories * item.quantity,
                                      )}{" "}
                                      cal
                                    </p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                      <p>
                                        P:{" "}
                                        {Math.round(
                                          item.food.protein * item.quantity,
                                        )}
                                        g
                                      </p>
                                      <p>
                                        C:{" "}
                                        {Math.round(
                                          item.food.carbs * item.quantity,
                                        )}
                                        g
                                      </p>
                                      <p>
                                        F:{" "}
                                        {Math.round(
                                          item.food.fat * item.quantity,
                                        )}
                                        g
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-600 mb-4">
                  {isToday
                    ? "No meals logged for today"
                    : `No meals logged for ${selectedDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                </p>
                {isToday && (
                  <Link
                    href="/meal"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Log Your First Meal
                  </Link>
                )}
              </div>
            )}

            {/* Quick Actions */}
            {isToday && (
              <div className="flex items-center justify-center space-x-4">
                <Link
                  href="/meal"
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                >
                  Add New Meal
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
