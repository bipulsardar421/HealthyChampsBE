export class MealPlanDateModel {
    meal_plan_date: Date;

    public static create(meal_plan_date?: Date): MealPlanDateModel {
        return new MealPlanDateModel(meal_plan_date);
    }

    constructor(meal_plan_date?: Date) {
      this._initForm(meal_plan_date);
    }

    protected _initForm(meal_plan_date?: Date) {
        if(meal_plan_date) {
           this.meal_plan_date = meal_plan_date;
        }
    }
}