export interface RecipeCookMthdInterface {
    cooking_method_id:number,
    recipe_info_id: number,
    cooking_method: string
}

export interface CookieMethodInterface {
    cooking_method: string,

}

export interface RequestCookingMthdInterface{
    recipe_info_id: number,
    cooking_method: number,
    cookmethod: CookieMethodInterface,
}