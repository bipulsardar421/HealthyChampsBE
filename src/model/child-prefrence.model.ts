export class ChildPreferenceModel {
    nutrition_category_id: number = 0;

    public static create(nutrition_category?: number): ChildPreferenceModel {
        return new ChildPreferenceModel(nutrition_category);
    }
    constructor(nutrition_category?: number) {
        if (nutrition_category) {
            this._initFormObj(nutrition_category)
        }

    }
    protected _initFormObj(nutrition_category: number) {
        this.nutrition_category_id = nutrition_category;

    }

}

export class ChildPreferenceEditModel {
    nutrition_category_id: number = 0;
    child_info_id: number = 0;

    public static create(nutrition_category?: number, child_info_id?: number): ChildPreferenceEditModel {
        return new ChildPreferenceEditModel(nutrition_category, child_info_id);
    }
    constructor(nutrition_category?: number, child_info_id?: number) {
        if (nutrition_category && child_info_id) {
            this._initFormObj(nutrition_category, child_info_id)
        }

    }
    protected _initFormObj(nutrition_category: number, child_info_id: number) {
        this.nutrition_category_id = nutrition_category;
        this.child_info_id = child_info_id;
    }
}
