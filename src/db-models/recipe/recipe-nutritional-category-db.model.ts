import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RecipeNutritionalCatInterface } from "../../interface";
import { HighlyNutritionalDBModel } from "../highly-nutritional-db.model";
import { NutritionCategoryDBModel } from "../nutrition-category-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";

@Table({
    tableName: 'recipe_nutrition_category',
    timestamps: false
})
export class RecipeNutritionalCatDBModel extends Model implements RecipeNutritionalCatInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    recipe_nutritional_category_id: number;

    @Column
    @ForeignKey(() => RecipeInfoDBModel)
    recipe_info_id: number;
    
    @Column
    @ForeignKey(() => NutritionCategoryDBModel)
    nutritional_category_id: number;

    @BelongsTo(() => NutritionCategoryDBModel, 'nutritional_category_id')
    nutritional_details: NutritionCategoryDBModel[]

}