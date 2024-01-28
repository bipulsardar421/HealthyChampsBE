import {  
    AllowNull, 
    AutoIncrement,
    BelongsTo,
    Column,  
    ForeignKey,  
    HasMany, 
    Model, 
    NotEmpty, 
    PrimaryKey, 
    Table
 } from "sequelize-typescript";
import { MealPlanLunchInterface } from "../../interface";
import { RecipeInfoDBModel } from "../recipe/recipe-info-db.model";
import { MealPlanDateDBModel } from "./mealdate-db.model";
import { MealPlanDBModel } from "./mealplan-db.model";
import { RecipeEditDBModel } from "../recipe/recipe-edit-db.model";
import { decrypted, encrypted } from "../../helper";

@Table({
    tableName: "meal_plan_lunch",
    timestamps: false,
})
export class MealPlanLunchDBModel extends Model implements MealPlanLunchInterface{

    @PrimaryKey
    @AutoIncrement
    @Column
    lunch_id: number;

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