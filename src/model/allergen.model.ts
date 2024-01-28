import { AllergenInterface } from "../interface";

export class AllergenModel {
    allergen_id: number = 0;
    allergen: string = ''
   
    constructor(allergen: AllergenInterface) {
        Object.assign(this, allergen)
    }
}