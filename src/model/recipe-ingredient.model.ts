import { decrypted } from "../helper";
import { RecipeAltIngredienInterface, RecipeIngredienInterface, RecipeIntergrentAltInterface } from "../interface";

export class RecipeIngredientModel {

  recipe_info_id: number | string;
  ing_category_id: number | string;
  quantity: number | string;
  measurement_id: number | string;
  form_id: number | string;
  ing_brandname_id: number;
  status: string = 'active';
  alternateIngredient: RecipeAltIngredientModel[] = []

  public static create(recipeAltIngredient?: RecipeIngredienInterface, recipeId?: number): RecipeIngredientModel {
    const instance = new RecipeIngredientModel(recipeAltIngredient, recipeId);
    return instance
  }

  constructor(recipeAltIngredient?: RecipeIngredienInterface, recipeId?: number) {
    this._initObject(recipeAltIngredient, recipeId)
  }

  protected _initObject(recipeAltIngredient?: RecipeIngredienInterface, recipeId?: number) {
    this.recipe_info_id = recipeId;
    this.ing_category_id = parseInt(recipeAltIngredient.category)
    this.quantity = parseInt(recipeAltIngredient.quantity);
    this.measurement_id = recipeAltIngredient.measurements;
    this.form_id = recipeAltIngredient.form;
    this.ing_brandname_id = !!recipeAltIngredient.name && recipeAltIngredient.name|| 0;
    if (recipeAltIngredient.alternativeingredientOpst === 'yes') {
      this.alternateIngredient = recipeAltIngredient.alternativeingredient.map(val => RecipeAltIngredientModel.create(val))
    }
  }
}


export class RecipeAltIngredientModel {

  ing_category_id: number | string;
  quantity: number | string;
  measurement_id: number | string;
  form_id: number | string;
  ing_brandname_id: number;
  status: string;

  public static create(alternateIngredient?: RecipeAltIngredienInterface): RecipeAltIngredientModel {
    const instance = new RecipeAltIngredientModel(alternateIngredient);
    return instance;
  }
  constructor(alternateIngredient?: RecipeAltIngredienInterface) {
    this._initObject(alternateIngredient)
  }

  protected _initObject(alternateIngredient?: RecipeAltIngredienInterface) {
    this.ing_category_id = parseInt(alternateIngredient.category)
    this.quantity = parseInt(alternateIngredient.quantity);
    this.measurement_id = alternateIngredient.measurements;
    this.form_id = alternateIngredient.form;
    this.ing_brandname_id = !!alternateIngredient.name && alternateIngredient.name || 0 ;
  }
}