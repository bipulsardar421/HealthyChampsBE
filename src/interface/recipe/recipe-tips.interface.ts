export interface RecipeTipsInterface {
    tips_id: number,
    recipe_info_id: number,
    recipe_tips: string,
}
export interface CookieTipeInterface {
    recipe_tips: string,

}

export interface RequestRecipeTipsInterface {
    tips_id: number,
    recipe_info_id: number,
    cookingtips:CookieTipeInterface,
}