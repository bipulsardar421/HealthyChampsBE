export class MealPlanAgeGroupModel {
    age_group_id: number = 0;

    public static create(ageGroup?: number): MealPlanAgeGroupModel {
     return new MealPlanAgeGroupModel(ageGroup);
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