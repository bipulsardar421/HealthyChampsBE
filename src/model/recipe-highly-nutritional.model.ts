export class RecipeHighlyNutriModel{
    highly_nutritional_id: number = 0;

    public static create(highly_nutritional?: number): RecipeHighlyNutriModel{
        return new RecipeHighlyNutriModel(highly_nutritional);
    }
    constructor(highly_nutritional?:number){
        if(highly_nutritional){
            this._initFormObj(highly_nutritional)
        }

    }
    protected _initFormObj(highly_nutritional:number){
        this.highly_nutritional_id=highly_nutritional;

    }
}

export class RecipeHighlyNutriEditModel{
    highly_nutritional_id: number = 0;
    recipe_info_id: number = 0;

    public static create(highly_nutritional?: number, recipe_info_id?: number): RecipeHighlyNutriEditModel{
        return new RecipeHighlyNutriEditModel(highly_nutritional, recipe_info_id);
    }
    constructor(highly_nutritional?:number, recipe_info_id?: number){
        if(highly_nutritional && recipe_info_id){
            this._initFormObj(highly_nutritional, recipe_info_id)
        }

    }
    protected _initFormObj(highly_nutritional:number, recipe_info_id: number){
        this.highly_nutritional_id = highly_nutritional;
        this.recipe_info_id = recipe_info_id;
    }
}