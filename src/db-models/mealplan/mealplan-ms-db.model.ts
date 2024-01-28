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
import { MealPlanMsInterface } from "../../interface";
import { RecipeInfoDBModel } from "../recipe/recipe-info-db.model";
import { MealPlanDateDBModel } from "./mealdate-db.model";
import { MealPlanDBModel } from "./mealplan-db.model";
import { RecipeEditDBModel } from "../recipe/recipe-edit-db.model";
import { decrypted, encrypted } from "../../helper";

@Table({
    tableName: "meal_plan_ms",
    timestamps: false,
})
export class MealPlanMsDBModel extends Model implements MealPlanMsInterface{

    @PrimaryKey
    @AutoIncrement
    @Column
    morning_snack_id: number;

    @AllowNull
    @NotEmpty
    @Column
    meal_plan_id: number;

   
    @ForeignKey(() => MealPlanDateDBModel)
    @Column
    mealplan_date_id: number;

    @AllowNull
    @NotEmpty
    @ForeignKey(() => RecipeEditDBModel)
    @Column
    recipe_info_id: number;



    @BelongsTo(() => RecipeEditDBModel, 'recipe_info_id')
    recipes: RecipeEditDBModel[];

    @AllowNull
    @NotEmpty
    @Column
    servings: number;
}