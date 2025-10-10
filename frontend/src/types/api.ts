export interface ApiMealItem {
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

export interface ApiMeal {
  id: number;
  date: string;
  mealType?: string;
  items: ApiMealItem[];
  calculatedNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DayData {
  date: string;
  meals: ApiMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
