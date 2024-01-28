import { RecipeCookMthdDBModel, RecipeImageDBModel, RecipeIngredientListDBModel, RecipeTipsDBModel, RecipeVideoDBModel } from "../../db-models";
import { RecipeAgeGroupInterface } from "./recipe-age-group.interface";
import { RecipeAllergenInterface } from "./recipe-allergen.interface";
import { RecipeDietaryInterface } from "./recipe-dietary.interface";
import { RecipeHighlyNutriInterface } from "./recipe-highly-nutritional.interface";
import { RecipeNutritionalCatInterface } from "./recipe-nutritiona-category.interface";

export type RecipeEditInterface = {
  recipe_info_id: number;
  recipe_name: string;
  dietary?: RecipeDietaryInterface[];
  allergen?: RecipeAllergenInterface[];
  highly_nutritional: RecipeHighlyNutriInterface[];
  preparation_time: string;
  cooking_time: string;
  calories: number;
  difficulty_level: string;
  age_group: RecipeAgeGroupInterface[];
  meal_type: number;
  nutrition_category: RecipeNutritionalCatInterface[];
  no_of_serves: number;
  meal_time: string;
  // recipe_ingredient: RecipeIngredientListDBModel[];
  // cook_method:RecipeCookMthdDBModel;
  // recipe_tip:RecipeTipsDBModel;
  // recipe_images:RecipeImageDBModel;
  // recipe_videos:RecipeVideoDBModel;
};