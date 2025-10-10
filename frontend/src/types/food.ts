export interface FoodSearchResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
  dataType: string;
  publishedDate: string;
}

export interface FoodSearchResponse {
  foods: FoodSearchResult[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export interface FoodNutrient {
  type: string;
  nutrient: {
    id: number;
    number: string;
    name: string;
    rank: number;
    unitName: string;
  };
  amount: number;
  id?: number;
  dataPoints?: number;
  max?: number;
  min?: number;
  median?: number;
  minYearAcquired?: number;
  foodNutrientDerivation?: {
    id: number;
    code: string;
    description: string;
  };
}

export interface FoodDetails {
  fdcId: number;
  description: string;
  brandOwner?: string;
  dataType: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients: FoodNutrient[];
  publishedDate: string;
}

export interface MealItem {
  foodId: number;
  foodName: string;
  quantity: number;
  calories: number;
  servingDescription?: string;
  id?: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface Meal {
  userId?: number;
  date: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  items: MealItem[];
}
