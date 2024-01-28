export class MealPlanDietaryModel {
    dietary_id: number = 0;

    public static create(dietary?: number): MealPlanDietaryModel {
     return new MealPlanDietaryModel(dietary);
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