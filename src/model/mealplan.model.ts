import { removeDuplicates } from "../lib";
import {
    MealAgeGroupInterface,
    MealDietaryInterface,
    RequestMealPlanInterface
} from "../interface";
import { MealPlanAgeGroupModel } from "./mealplan-age-group.model";
import {
    MealPlanDietaryModel
} from "./mealplan-dietary.model";


export class MealPlanAddModel {
    meal_plan_name: string = '';
    meal_plan_date: Date;
    status: string = 'active';
    user_id: number = 0;
    dietary: Partial<MealDietaryInterface>[] = [];
    age_group: Partial<MealAgeGroupInterface>[] = [];
    logo : string = '';
    description: string = '';

    public static create(mealInfo?: RequestMealPlanInterface): MealPlanAddModel {
        return new MealPlanAddModel(mealInfo)
    }

    constructor(mealInfo?: RequestMealPlanInterface) {
        if (mealInfo) {
            this._intFormObj(mealInfo);
        }
    }

    protected _intFormObj(mealInfo?: RequestMealPlanInterface) {
        Object.assign(this, mealInfo);
        this.dietary = mealInfo.dietary.map(dietaryList => MealPlanDietaryModel.create(dietaryList));
        this.age_group = mealInfo.age_group
            .map(age_group_list => MealPlanAgeGroupModel.create(age_group_list));

    }
}
export class MealPlanCollectionsDataModel {

    mealPlanDetails: any;
    mealPlanList: any;

    public static create(mealPlanList?: any[], getDropvalue?: any[]): MealPlanCollectionsDataModel {
        return new MealPlanCollectionsDataModel(mealPlanList, getDropvalue);
    }

    constructor(mealPlanList?: any[], getDropvalue?: any[]) {
        if (mealPlanList) {
            this._initFormObj(mealPlanList, getDropvalue)
        }
    }

    protected _initFormObj(mealPlan?: any[], getDropvalue?: any[]) {
       const removeDuplicatevl: any[] =   mealPlan && removeDuplicates(mealPlan, 'meal_plan_date')|| []
       this.mealPlanDetails = mealPlan && removeDuplicatevl.slice(0,7)|| [];
       const coverMealPlan = (getDropvalue)? Array.from(getDropvalue).map(val => MealPlanListModel.create(val.meal_plan)) : 
       Array.from(mealPlan).map(val => MealPlanListModel.create(val.meal_plan))
       this.mealPlanList = removeDuplicates(coverMealPlan, 'meal_plan_id')
    }
}

export class MealPlanListModel {
    meal_plan_id: any;
    meal_plan_name: string;
    logo: string;
    description: string;


    public static create(mealPlanList?: any): MealPlanListModel {
        return new MealPlanListModel(mealPlanList);
    }

    constructor(mealPlanList?: any) {
        if (mealPlanList) {
            this._initFormObj(mealPlanList)
        }
    }

    protected _initFormObj(mealPlanList?: any) {
      this.meal_plan_id = mealPlanList.meal_plan_id || '0';
      this.meal_plan_name = mealPlanList.meal_plan_name || '';
      this.logo = mealPlanList.logo || '';
      this.description = mealPlanList.description || ''
    }
}