export class RecipeDietaryModel {
    dietary_id: number = 0;

    public static create(dietary?: number): RecipeDietaryModel {
     return new RecipeDietaryModel(dietary);
    }

    constructor(dietary?: number) {
     if(dietary) {
        this._initFormObj(dietary)
     }
    }

    protected _initFormObj(dietary: number) {
        this.dietary_id = dietary;
    }
}

export class RecipeDietaryEditModel {
    dietary_id: number = 0;
    recipe_info_id: number = 0;

    public static create(dietary?: number, recipe_info_id?: number): RecipeDietaryEditModel {
     return new RecipeDietaryEditModel(dietary, recipe_info_id);
    }

    constructor(dietary?: number, recipe_info_id?: number) {
     if(dietary && recipe_info_id) {
        this._initFormObj(dietary, recipe_info_id)
     }
    }

    protected _initFormObj(dietary: number, recipe_info_id: number) {
        this.dietary_id = dietary;
        this.recipe_info_id = recipe_info_id;
    }
}