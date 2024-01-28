import {
    RecipeAgeGroupInterface,
    RecipeAllergenInterface,
    RecipeDietaryInterface,
    RecipeHighlyNutriInterface,
    RecipeNutritionalCatInterface,
    RequestRecipeInfoInterface
} from "../interface";
import { RecipeAgeGroupModel } from "./recipe-age-group.model";
import {
    RecipeAllergenModel
} from "./recipe-allergen.model";
import {
    RecipeDietaryModel
} from "./recipe-dietary.model";
import { RecipeHighlyNutriModel } from "./recipe-highly-nutritional.model";
import { RecipeNutritionalCatModel } from "./recipe-nutritional-category.model";

export class RecipeAddModel {
    recipe_name: string = '';
    preparation_time: string = '';
    cooking_time: string = '';
    calories: number = 0;
    difficulty_level: string = '';
    meal_type: number = 0;
    no_of_serves: number = 0;
    meal_time: string = '';
    status: string = 'active';
    user_id: number = 0;
    dietary: Partial<RecipeDietaryInterface>[] = [];
    allergen: Partial<RecipeAllergenInterface>[];
    highly_nutritional: Partial<RecipeHighlyNutriInterface>[] = [];
    age_group: Partial<RecipeAgeGroupInterface>[] = [];
    nutrition_category: Partial<RecipeNutritionalCatInterface>[] = [];

    public static create(recipeInfo?: RequestRecipeInfoInterface): RecipeAddModel {
        return new RecipeAddModel(recipeInfo)
    }

    constructor(recipeInfo?: RequestRecipeInfoInterface) {
        if (recipeInfo) {
            this._intFormObj(recipeInfo);
        }
    }

    protected _intFormObj(recipeInfo?: RequestRecipeInfoInterface) {
        Object.assign(this, recipeInfo);
        this.dietary = recipeInfo.dietary.map(dietaryList => RecipeDietaryModel.create(dietaryList));
        this.allergen = recipeInfo.allergen.map(allergenList => RecipeAllergenModel.create(allergenList));
        this.highly_nutritional = recipeInfo.highly_nutritional
        .map(highly_nutritionalList => RecipeHighlyNutriModel.create(highly_nutritionalList));
        this.age_group = recipeInfo.age_group
        .map(age_group_list => RecipeAgeGroupModel.create(age_group_list));
        this.nutrition_category = recipeInfo.nutrition_category
        .map(nutrition_category_list => RecipeNutritionalCatModel.create(nutrition_category_list));
    }
}