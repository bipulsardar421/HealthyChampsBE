export interface RecipeIngredientInterface {
  recipe_ing_id: number;
  recipe_info_id: number,
  ing_category_id: number,
  quantity: number,
  ing_brandname_id: number,
  measurement_id: number,
  form_id: number,
}
// export interface RecipeIngInterface{
//     ing_category: number,
//     quantity: number,
//     ing_brandname: number,
//     ing_status: boolean
// }

export interface RequestRecipeIngredientInterface {
  // recipe_ing_id: number;
  recipe_info_id: number,
  ing_category: number,
  quantity: number,
  ing_brandname: number,
  ing_status: boolean,
  measurement_id: number,
  form_id: number,


}

export interface RecipeAltIngredienInterface {
  category: string,
  name: number,
  quantity: string,
  measurements: number,
  form: number,
}

export interface RecipeIngredienInterface {

  alternativeingredient: RecipeAltIngredienInterface[],
  alternativeingredientOpst: string,
  category: string,
  name: number,
  quantity: string,
  measurements: number,
  form: number,

}

export interface RecipeIntergrentAltInterface {
  ingredients: RecipeIngredienInterface[],
  recipeInfo: number,
}


