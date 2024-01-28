export class ChildDietaryModel {
    dietary_id: number = 0;

    public static create(dietary?: number): ChildDietaryModel {
     return new ChildDietaryModel(dietary);
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

export class ChildDietaryEditModel {
    dietary_id: number = 0;
    child_info_id: number = 0;

    public static create(dietary?: number, child_info_id?: number): ChildDietaryEditModel {
     return new ChildDietaryEditModel(dietary, child_info_id);
    }

    constructor(dietary?: number, child_info_id?: number) {
     if(dietary && child_info_id) {
        this._initFormObj(dietary, child_info_id)
     }
    }

    protected _initFormObj(dietary: number, child_info_id: number) {
        this.dietary_id = dietary;
        this.child_info_id = child_info_id;
    }
}