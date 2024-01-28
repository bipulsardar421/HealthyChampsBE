import {
    ChildAllergenInterface,
    ChildDietaryInterface,
    ChildPreferenceInterface,
    RequestChildInfoInterface
  } from "../interface";
  import { ChildAllergenModel } from "./child-allergen.model";
  import { ChildDietaryModel } from "./child-dietary.model";
  import { ChildPreferenceModel } from "./child-prefrence.model";
  
  export class ChildAddModel {
    date_of_birth: string = '';
    child_name: string = '';
    status: string = 'active';
    dietary: Partial<ChildDietaryInterface>[] = [];
    allergen: Partial<ChildAllergenInterface>[] = [];
    nutrition_category: Partial<ChildPreferenceInterface>[] = [];
  
    public static create(childInfo?: RequestChildInfoInterface): ChildAddModel {
      return new ChildAddModel(childInfo);
    }
  
    constructor(childInfo?: RequestChildInfoInterface) {
      if (childInfo) {
        this._initFromObj(childInfo);
      }
    }
  
    protected _initFromObj(childInfo?: RequestChildInfoInterface) {
      Object.assign(this, childInfo);
      this.dietary = childInfo.dietary.map(dietaryList => ChildDietaryModel.create(dietaryList));
      this.allergen = childInfo.allergen.map(allergenList => ChildAllergenModel.create(allergenList));
      this.nutrition_category = childInfo.nutrition_category.map(
        nutrition_category_list => ChildPreferenceModel.create(nutrition_category_list)
      );
    }
  }
  