export class RecipeAllergenModel {
    allergen_id: number = 0;

    public static create(allergen?: number): RecipeAllergenModel {
     return new RecipeAllergenModel(allergen);
    }

    constructor(allergen?: number) {
     if(allergen) {
        this._initFormObj(allergen)
     }
    }

    protected _initFormObj(allergen: number) {
        this.allergen_id = allergen;
    }
}

export class RecipeAllergenEditModel {
    allergen_id: number = 0;
    recipe_info_id: number = 0;

    public static create(allergen?: number, recipe_info_id?: number): RecipeAllergenEditModel {
     return new RecipeAllergenEditModel(allergen, recipe_info_id);
    }

    constructor(allergen?: number, recipe_info_id?: number) {
     if(allergen && recipe_info_id) {
        this._initFormObj(allergen, recipe_info_id)
     }
    }

    protected _initFormObj(allergen: number, recipe_info_id: number) {
        this.allergen_id = allergen;
        this.recipe_info_id = recipe_info_id;
    }
}