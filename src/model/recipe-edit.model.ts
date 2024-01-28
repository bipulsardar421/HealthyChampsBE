import {
    RecipeAgeGroupInterface,
    RecipeAllergenInterface,
    RecipeCookMthdInterface,
    RecipeDietaryInterface,
    RecipeHighlyNutriInterface,
    RecipeImageInterface,
    RecipeInfoInterface,
    RecipeIngredienInterface,
    RecipeNutritionalCatInterface,
    RecipeTipsInterface,
    RecipeVideoInterface,
    RequestRecipeInfoInterface
} from "../interface";

export class RecipeEditModel {
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
    dietary: number[] = [];
    allergen: number[] = [];
    highly_nutritional: number[] = [];
    age_group: number[] = [];
    nutrition_category: number[] = [];
    dietarys: Partial<RecipeDietaryInterface>[] = [];
    allergens: Partial<RecipeAllergenInterface>[];
    highly_nutritionals: Partial<RecipeHighlyNutriInterface>[] = [];
    age_groups: Partial<RecipeAgeGroupInterface>[] = [];
    nutrition_categorys: Partial<RecipeNutritionalCatInterface>[] = [];
    recipe_ingredient: RecipeIngredienInterface[] = [];
    cook_method: RecipeCookMthdInterface[] = [];
    recipe_tip: RecipeTipsInterface[] = [];
    recipe_images: RecipeImageInterface[] = [];
    recipe_videos: RecipeVideoInterface[] = [];

    public static create(recipeInfo?: RecipeInfoInterface): RecipeEditModel {
        return new RecipeEditModel(recipeInfo)
    }

    constructor(recipeInfo?: RecipeInfoInterface) {
        if (recipeInfo) {
            this._intFormObj(recipeInfo);
        }
    }

    protected _intFormObj(recipeInfo?: RecipeInfoInterface) {
        console.log(recipeInfo);
        Object.assign(this, recipeInfo);
        this.dietarys = recipeInfo.dietary;
        this.allergens = recipeInfo.allergen;
        this.highly_nutritionals = recipeInfo.highly_nutritional;
        this.age_groups = recipeInfo.age_group;
        this.nutrition_categorys = recipeInfo.nutrition_category;
        this.dietary = recipeInfo.dietary.map(list => list.dietary_id);
        this.allergen = recipeInfo.allergen.map(list => list.allergen_id);
        this.age_group = recipeInfo.age_group.map(list => list.age_group_id);
        this.highly_nutritional = recipeInfo.highly_nutritional.map(list => list.highly_nutritional_id);
        this.nutrition_category = recipeInfo.nutrition_category.map(list => list.nutritional_category_id)
    }
}