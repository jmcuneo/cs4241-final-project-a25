import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { addMeal, searchFoods, getFoodDetails } from "../api/client";
import type {
  FoodSearchResult,
  FoodDetails,
  MealItem,
  FoodNutrient,
} from "../types/food";

export default function MealForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [foodDetails, setFoodDetails] = useState<FoodDetails | null>(null);
  const [isEditingCalories, setIsEditingCalories] = useState(false);

  const form = useForm({
    defaultValues: {
      selectedFood: null as FoodSearchResult | null,
      quantity: 1,
      calories: 0,
      mealItems: [] as MealItem[],
      mealType: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
      date: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      if (value.mealItems.length === 0) {
        alert("Please add at least one food item to your meal.");
        return;
      }

      try {
        const mealItemsWithIds = value.mealItems.map((item: MealItem) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          foodName: item.foodName,
          calories: item.calories,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
        }));

        const meal = {
          date: new Date(value.date).toISOString(),
          mealType: value.mealType,
          items: mealItemsWithIds,
        };

        await addMeal(meal);

        // Reset form
        form.reset();
        setSearchQuery("");
        setSearchResults([]);
        setFoodDetails(null);
        setIsEditingCalories(false);

        alert("Meal added successfully!");
      } catch (error) {
        console.error("Failed to add meal:", error);
        alert("Failed to add meal. Please try again.");
      }
    },
  });

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const results = await searchFoods(searchQuery);
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

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  useEffect(() => {
    const selectedFood = form.state.values.selectedFood;
    if (selectedFood && !foodDetails) {
      setIsLoadingDetails(true);
      getFoodDetails(selectedFood.fdcId)
        .then((details) => {
          setFoodDetails(details);
          // Auto-calculate calories
          const caloriesNutrient = details.foodNutrients?.find(
            (nutrient: FoodNutrient) =>
              nutrient.nutrient?.id === 1008 ||
              (nutrient.nutrient?.name &&
                nutrient.nutrient.name.toLowerCase().includes("energy")),
          );

          let calories = 0;
          if (caloriesNutrient) {
            const caloriesPer100g = caloriesNutrient.amount;
            const quantity = form.state.values.quantity;

            if (details.servingSize && details.servingSize > 0) {
              const caloriesPerServing =
                (caloriesPer100g * details.servingSize) / 100;
              calories = Math.round(caloriesPerServing * quantity);
            } else {
              calories = Math.round(caloriesPer100g * quantity);
            }
          }

          form.setFieldValue("calories", calories);
        })
        .catch((error) => {
          console.error("Error loading food details:", error);
        })
        .finally(() => {
          setIsLoadingDetails(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.state.values.selectedFood, foodDetails, form.state.values.quantity]);

  // Recalculate calories when quantity changes (if not manually editing)
  useEffect(() => {
    if (!isEditingCalories && foodDetails) {
      const caloriesNutrient = foodDetails.foodNutrients?.find(
        (nutrient: FoodNutrient) =>
          nutrient.nutrient?.id === 1008 ||
          (nutrient.nutrient?.name &&
            nutrient.nutrient.name.toLowerCase().includes("energy")),
      );

      let calories = 0;
      if (caloriesNutrient) {
        const caloriesPer100g = caloriesNutrient.amount;
        const quantity = form.state.values.quantity;

        if (foodDetails.servingSize && foodDetails.servingSize > 0) {
          const caloriesPerServing =
            (caloriesPer100g * foodDetails.servingSize) / 100;
          calories = Math.round(caloriesPerServing * quantity);
        } else {
          calories = Math.round(caloriesPer100g * quantity);
        }
      }

      form.setFieldValue("calories", calories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.state.values.quantity, isEditingCalories, foodDetails]);

  const handleFoodSelect = (food: FoodSearchResult) => {
    form.setFieldValue("selectedFood", food);
    setFoodDetails(null);
    setIsEditingCalories(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleAddToMeal = () => {
    const selectedFood = form.state.values.selectedFood;
    const quantity = form.state.values.quantity;
    const calories = form.state.values.calories;

    if (!selectedFood) return;

    let servingDescription = "serving";
    if (foodDetails?.householdServingFullText) {
      servingDescription = foodDetails.householdServingFullText;
    } else if (foodDetails?.servingSizeUnit) {
      servingDescription = `${foodDetails.servingSize || 100}${foodDetails.servingSizeUnit}`;
    }

    // Extract nutrition data from current foodDetails
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    if (foodDetails?.foodNutrients) {
      const nutrients = foodDetails.foodNutrients;

      // Extract protein (nutrient ID 1003)
      const proteinNutrient = nutrients.find(
        (n: FoodNutrient) => n.nutrient?.id === 1003,
      );
      if (proteinNutrient) {
        protein = proteinNutrient.amount || 0;
      }

      // Extract carbs (nutrient ID 1005)
      const carbsNutrient = nutrients.find(
        (n: FoodNutrient) => n.nutrient?.id === 1005,
      );
      if (carbsNutrient) {
        carbs = carbsNutrient.amount || 0;
      }

      // Extract fat (nutrient ID 1004)
      const fatNutrient = nutrients.find(
        (n: FoodNutrient) => n.nutrient?.id === 1004,
      );
      if (fatNutrient) {
        fat = fatNutrient.amount || 0;
      }
    }

    const newItem: MealItem = {
      foodId: selectedFood.fdcId,
      foodName: selectedFood.description,
      quantity,
      calories,
      servingDescription,
      id: `${selectedFood.fdcId}-${Date.now()}-${Math.random()}`,
      protein,
      carbs,
      fat,
    };

    const currentItems = form.state.values.mealItems;
    form.setFieldValue("mealItems", [...currentItems, newItem]);
    form.setFieldValue("selectedFood", null as FoodSearchResult | null);
    form.setFieldValue("quantity", 1);
    form.setFieldValue("calories", 0);
    setFoodDetails(null);
    setIsEditingCalories(false);
  };

  const handleRemoveItem = (itemId: string) => {
    const currentItems = form.state.values.mealItems;
    const newItems = currentItems.filter((item) => item.id !== itemId);
    form.setFieldValue("mealItems", newItems);
  };

  const selectedFood = form.state.values.selectedFood;

  return (
    <div className="w-2xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Meal</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Meal Type and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <form.Field
            name="mealType"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type:
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value as
                        | "breakfast"
                        | "lunch"
                        | "dinner"
                        | "snack",
                    )
                  }
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            )}
          />

          <form.Field
            name="date"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date:
                </label>
                <input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search for food:
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter food name (e.g., salmon, apple, bread)..."
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery.length > 0 && searchQuery.length <= 2 && (
            <p className="text-sm text-gray-500 mt-1">
              Type at least 3 characters to search
            </p>
          )}
        </div>
        {isSearching && (
          <div className="mb-6">
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <h3 className="text-black text-lg font-semibold mb-3">
              Search Results:
            </h3>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              {searchResults.slice(0, 10).map((food) => (
                <div
                  key={food.fdcId}
                  onClick={() => handleFoodSelect(food)}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <h4 className="font-medium text-gray-900">
                    {food.description}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Food Details */}
        {selectedFood && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Selected Food: {selectedFood.description}
            </h3>

            {isLoadingDetails && (
              <p className="text-gray-600">Loading nutrition information...</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <form.Field
                name="quantity"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="calories"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calories:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        readOnly={!isEditingCalories}
                        className={`text-black flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          !isEditingCalories ? "bg-gray-50" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingCalories(!isEditingCalories);
                          if (isEditingCalories && foodDetails) {
                            // Reset to auto-calculated value
                            const caloriesNutrient =
                              foodDetails.foodNutrients?.find(
                                (nutrient: FoodNutrient) =>
                                  nutrient.nutrient?.id === 1008 ||
                                  (nutrient.nutrient?.name &&
                                    nutrient.nutrient.name
                                      .toLowerCase()
                                      .includes("energy")),
                              );

                            let autoCalories = 0;
                            if (caloriesNutrient) {
                              const caloriesPer100g = caloriesNutrient.amount;
                              const quantity = form.state.values.quantity;

                              if (
                                foodDetails.servingSize &&
                                foodDetails.servingSize > 0
                              ) {
                                const caloriesPerServing =
                                  (caloriesPer100g * foodDetails.servingSize) /
                                  100;
                                autoCalories = Math.round(
                                  caloriesPerServing * quantity,
                                );
                              } else {
                                autoCalories = Math.round(
                                  caloriesPer100g * quantity,
                                );
                              }
                            }
                            field.handleChange(autoCalories);
                          }
                        }}
                        className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                      >
                        {isEditingCalories ? "Auto" : "Edit"}
                      </button>
                    </div>
                    {!isEditingCalories && (
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-calculated from nutrition data
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <button
              type="button"
              onClick={handleAddToMeal}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add to Meal
            </button>
          </div>
        )}

        {/* Meal Items */}
        <form.Subscribe
          selector={(state) => state.values.mealItems}
          children={(mealItems) => (
            <>
              {mealItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Meal Items:</h3>
                  <div className="space-y-2">
                    {mealItems.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{item.foodName}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} {item.servingDescription}{" "}
                            • Calories: {item.calories}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveItem(item.id || `fallback-${index}`);
                          }}
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
                  </div>
                </div>
              )}
            </>
          )}
        />

        {/* Submit Meal */}
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
            mealItems: state.values.mealItems,
          })}
          children={({ canSubmit, isSubmitting, mealItems }) => (
            <button
              type="submit"
              disabled={!canSubmit || mealItems.length === 0}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding Meal..." : "Save Meal"}
            </button>
          )}
        />
      </form>
    </div>
  );
}
