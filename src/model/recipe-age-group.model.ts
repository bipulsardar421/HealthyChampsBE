export class RecipeAgeGroupModel {
    age_group_id: number = 0;

    public static create(ageGroup?: number): RecipeAgeGroupModel {
     return new RecipeAgeGroupModel(ageGroup);
    }

    constructor(ageGroup?: number) {
     if(ageGroup) {
        this._initFormObj(ageGroup)
     }
    }

    protected _initFormObj(ageGroup: number) {
        this.age_group_id = ageGroup;
    }
}

export class RecipeAgeGroupEditModel {
    age_group_id: number = 0;
    recipe_info_id: number = 0;

    public static create(ageGroup?: number, recipe_info_id?: number): RecipeAgeGroupEditModel {
     return new RecipeAgeGroupEditModel(ageGroup, recipe_info_id);
    }

    constructor(ageGroup?: number, recipe_info_id?: number) {
     if(ageGroup && recipe_info_id) {
        this._initFormObj(ageGroup, recipe_info_id)
     }
    }

    protected _initFormObj(ageGroup: number, recipe_info_id?: number) {
        this.age_group_id = ageGroup;
        this.recipe_info_id = recipe_info_id;
    }
}