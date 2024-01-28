import { encrypted } from "../helper";
import { ChildAllergenInterface, ChildDietaryInterface, ChildInfoInterface, ChildPreferenceInterface, RecipeAllergenInterface } from "../interface";

export class ChildEditModel {
    child_name: string = '';
    date_of_birth: string = '';
    parent_id: string = '';
    status: string = 'active';
    dietary: number[] = [];
    allergen: number[] = [];
    nutrition_category: number[] = [];
    dietarys: Partial<ChildDietaryInterface>[] = [];
    allergens: Partial<ChildAllergenInterface>[];
    nutrition_categorys: Partial<ChildPreferenceInterface>[] = [];

    public static create(childInfo?: ChildInfoInterface): ChildEditModel {
        return new ChildEditModel(childInfo)
    }

    constructor(childInfo?: ChildInfoInterface) {
        if (childInfo) {
            this._intFormObj(childInfo);
        }
    }

    protected _intFormObj(childInfo?: ChildInfoInterface) {
        console.log(childInfo, 'pjak');
        Object.assign(this, childInfo);
        this.parent_id = encrypted(childInfo.parent_id);   
        this.dietarys = childInfo.dietary;
        this.allergens = childInfo.allergen;
        this.nutrition_categorys = childInfo.nutrition_category;
        this.dietary = childInfo.dietary.map(list => list.dietary_id);
        this.allergen = childInfo.allergen.map(list => list.allergen_id);
        this.nutrition_category = childInfo.nutrition_category.map(list => list.nutrition_category_id)
    }
}