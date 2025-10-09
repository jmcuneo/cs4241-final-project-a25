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
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
  rank?: number;
  indentLevel?: number;
  foodNutrientId: number;
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
}

export interface Meal {
  userId?: number;
  date: string;
  items: MealItem[];
}
