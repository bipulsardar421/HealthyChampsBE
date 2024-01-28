import {  
    AllowNull, 
    AutoIncrement,
    BelongsTo,
    Column, 
    DataType, 
    ForeignKey, 
    HasMany, 
    Model, 
    NotEmpty, 
    PrimaryKey, 
    Table
 } from "sequelize-typescript";
import { MealPlanEsInterface } from "../../interface/mealplan/mealplanes.interface";
import { MealPlanBfInterface } from "../../interface";
import { RecipeInfoDBModel } from "../recipe/recipe-info-db.model";
import { MealPlanDateDBModel } from "./mealdate-db.model";
import { MealPlanDBModel } from "./mealplan-db.model";
import { RecipeEditDBModel } from "../recipe/recipe-edit-db.model";
import { decrypted, encrypted } from "../../helper";

@Table({
    tableName: "meal_plan_es",
    timestamps: false,
})
export class MealPlanEsDBModel extends Model implements MealPlanEsInterface{

    @PrimaryKey
    @AutoIncrement
    @Column
    evening_snack_id: number;

    @AllowNull
    @NotEmpty
    @Column
    meal_plan_id: number;

    @AllowNull
    @NotEmpty
    @ForeignKey(() => RecipeEditDBModel)
    @Column
    recipe_info_id: number;


    @AllowNull
    @NotEmpty
    @Column
    servings: number;

    @ForeignKey(() => MealPlanDateDBModel)
    @Column
    mealplan_date_id: number;

    @BelongsTo(() => RecipeEditDBModel, 'recipe_info_id')
    recipes: RecipeEditDBModel[];
}