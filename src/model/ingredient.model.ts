import { decrypted } from "../helper";
import { IngredientInterface } from "../interface";

export class IngredientBrandModel {
    sno: number;
    name: string;
    constructor(ingredient: IngredientInterface) {
        this.sno = ingredient.sno?parseInt(decrypted(ingredient.sno.toString())):0;
        this.name = ingredient.name || '';
    }
}