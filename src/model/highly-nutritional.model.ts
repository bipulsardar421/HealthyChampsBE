import { AllergenInterface, HighlyNutritionalInterface } from "../interface";

export class HighlyNutritionalModel {
    highly_nutritional_id: number = 0;
    highly_nutritional: string = ''
   
    constructor(highlyNutritional: HighlyNutritionalInterface) {
        Object.assign(this, highlyNutritional)
    }
}