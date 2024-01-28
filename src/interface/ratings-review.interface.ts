export type RecipeRatingsInterface = {
    recipe_ratings_id: number;
    date_time: Date;
    recipe_info_id: number;
    recipe_rating: number;
    parent_id: number;
    recipe_review: string
}

export type WorkshopRatingsInterface = {
    workshop_ratings_id: number;
    date_time: Date;
    workshop_info_id: number;
    workshop_rating: number;
    parent_id: number;
    workshop_review: string
}

export type BlogRatingsInterface = {
    blog_ratings_id: number;
    date_time: Date;
    blog_info_id: number;
    blog_rating: number;
    parent_id: number;
    blog_review: string
}