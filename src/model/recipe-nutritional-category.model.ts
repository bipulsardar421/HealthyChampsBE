export class RecipeNutritionalCatModel {
    nutritional_category_id: number = 0;

    public static create(nutritional_category?: number): RecipeNutritionalCatModel {
        return new RecipeNutritionalCatModel(nutritional_category);
    }
    constructor(nutritional_category?: number) {
        if (nutritional_category) {
            this._initFormObj(nutritional_category)
        }

    }
    protected _initFormObj(nutritional_category: number) {
        this.nutritional_category_id = nutritional_category;

    }

}

export class RecipeNutritionalCatEditModel {
    nutritional_category_id: number = 0;
    recipe_info_id: number = 0;

    public static create(nutritional_category?: number, recipe_info_id?: number): RecipeNutritionalCatEditModel {
        return new RecipeNutritionalCatEditModel(nutritional_category, recipe_info_id);
    }
    constructor(nutritional_category?: number, recipe_info_id?: number) {
        if (nutritional_category && recipe_info_id) {
            this._initFormObj(nutritional_category, recipe_info_id)
        }

    }
    protected _initFormObj(nutritional_category: number, recipe_info_id: number) {
        this.nutritional_category_id = nutritional_category;
        this.recipe_info_id = recipe_info_id;
    }
}
