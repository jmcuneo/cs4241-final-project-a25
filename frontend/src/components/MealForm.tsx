import { useState } from "react";
import { addMeal, searchFoods } from "../api/client";
import type { FoodSearchResult, MealItem } from "../types/food";

export default function MealForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(
    null,
  );
  const [quantity, setQuantity] = useState(100);
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeoutId = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        try {
          const results = await searchFoods(query);
          setSearchResults(results.foods || []);
        } catch (error) {
          console.error("Error searching foods:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    setSearchTimeout(timeoutId);
  };

  const handleFoodSelect = (food: FoodSearchResult) => {
    setSelectedFood(food);
    setSearchResults([]);
    setSearchQuery("");
    // Reset nutrition values when selecting a new food
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
  };

  const handleAddToMeal = () => {
    if (!selectedFood) return;

    const newItem: MealItem = {
      foodId: selectedFood.fdcId,
      foodName: selectedFood.description,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      id: `${selectedFood.fdcId}-${Date.now()}`,
    };

    setMealItems([...mealItems, newItem]);
    // Reset nutrition values but keep selected food for adding more
    setQuantity(100);
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
  };

  const handleRemoveItem = (itemId: string) => {
    setMealItems(mealItems.filter((item) => item.id !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mealItems.length === 0) {
      alert("Please add at least one food item to your meal.");
      return;
    }

    try {
      const meal = {
        date: new Date(date).toISOString(),
        mealType,
        items: mealItems.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          foodName: item.foodName,
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
        })),
      };

      const response = await addMeal(meal);
      console.log("✅ Backend response:", response);

      // Reset form
      setMealItems([]);
      setSelectedFood(null);
      setQuantity(100);
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
      setSearchQuery("");
      setSearchResults([]);

      alert("Meal added successfully!");
    } catch (error) {
      console.error("Failed to add meal:", error);
      alert("Failed to add meal. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Meal</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date and Meal Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Type:
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as typeof mealType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        {/* Food Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search for food:
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for foods..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {isSearching && <p className="text-gray-600 mt-2">Searching...</p>}

          {searchResults.length > 0 && (
            <div className="mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md">
              {searchResults.map((food) => (
                <button
                  key={food.fdcId}
                  type="button"
                  onClick={() => handleFoodSelect(food)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                >
                  <div className="font-medium">{food.description}</div>
                  {food.brandOwner && (
                    <div className="text-sm text-gray-600">
                      {food.brandOwner}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Food and Manual Input */}
        {selectedFood && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              {selectedFood.description}
            </h3>

            <div className="space-y-4">
              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (grams):
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Manual Nutrition Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories:
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value) || 0)}
                    placeholder="Enter calories"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g):
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value) || 0)}
                    placeholder="Enter protein"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g):
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value) || 0)}
                    placeholder="Enter carbs"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g):
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={fat}
                    onChange={(e) => setFat(Number(e.target.value) || 0)}
                    placeholder="Enter fat"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm text-blue-600 font-medium mb-2">
                  Nutrition Summary:
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm text-center">
                  <div>
                    <div className="font-medium text-blue-900">{calories}</div>
                    <div className="text-xs text-blue-700">Calories</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">{protein}g</div>
                    <div className="text-xs text-blue-700">Protein</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">{carbs}g</div>
                    <div className="text-xs text-blue-700">Carbs</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">{fat}g</div>
                    <div className="text-xs text-blue-700">Fat</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleAddToMeal}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add to Meal
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFood(null);
                  setSearchQuery("");
                  setSearchResults([]);
                  setCalories(0);
                  setProtein(0);
                  setCarbs(0);
                  setFat(0);
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Meal Items */}
        {mealItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Meal Items:</h3>
            <div className="space-y-2">
              {mealItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{item.foodName}</h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity}g • {item.calories} cal • P: {item.protein}
                      g • C: {item.carbs}g • F: {item.fat}g
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id!)}
                    className="ml-2 px-2 py-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-lg font-semibold text-blue-800">
                Total Calories:{" "}
                {mealItems.reduce((sum, item) => sum + item.calories, 0)}
              </p>
              <p className="text-sm text-blue-600">
                Protein:{" "}
                {mealItems.reduce((sum, item) => sum + (item.protein || 0), 0)}g
                • Carbs:{" "}
                {mealItems.reduce((sum, item) => sum + (item.carbs || 0), 0)}g •
                Fat: {mealItems.reduce((sum, item) => sum + (item.fat || 0), 0)}
                g
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mealItems.length === 0}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Save Meal
        </button>
      </form>
    </div>
  );
}