export type MealPlanLunchInterface = {
    lunch_id: number;
    meal_plan_id: number;
    recipe_info_id: number;
    servings: number;
  };

  export type RequestMealPlanLunchInterface = {
    meal_plan_id: number;
    recipe_info_id: number;
    servings: number;
  };