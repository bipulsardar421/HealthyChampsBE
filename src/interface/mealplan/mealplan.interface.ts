import { MealAgeGroupInterface } from "./meal-plan-age-group.interface";
import { MealDietaryInterface } from "./meal-plan-dietary.interface";

export type MealPlanInterface = {
  meal_plan_id: number;
  meal_plan_name: string;
  status: string;
  logo: string;
  description: string;
  in_trend: boolean;
};

export interface RequestMealPlanInterface {
  meal_plan_name: string;
  dietary?: number[];
  age_group?: number[];
  meal_plan_date:Date[];
  logo: string;
  description: string;
  in_trend: boolean;
};
