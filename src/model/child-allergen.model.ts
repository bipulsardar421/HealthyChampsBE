export class ChildAllergenModel {
    allergen_id: number = 0;

    public static create(allergen?: number): ChildAllergenModel {
     return new ChildAllergenModel(allergen);
    }

    constructor(allergen?: number) {
     if(allergen) {
        this._initFormObj(allergen)
     }
    }

    protected _initFormObj(allergen: number) {
        this.allergen_id = allergen;
    }
}

export class ChildAllergenEditModel {
    allergen_id: number = 0;
    child_info_id: number = 0;

    public static create(allergen?: number, child_info_id?: number): ChildAllergenEditModel {
     return new ChildAllergenEditModel(allergen, child_info_id);
    }

    constructor(allergen?: number, child_info_id?: number) {
     if(allergen && child_info_id) {
        this._initFormObj(allergen, child_info_id)
     }
    }

    protected _initFormObj(allergen: number, child_info_id: number) {
        this.allergen_id = allergen;
        this.child_info_id = child_info_id;
    }
}