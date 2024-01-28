import {  
    AllowNull, 
    AutoIncrement,
    BelongsTo,
    Column, 
    Default, 
    ForeignKey, 
    HasMany, 
    Model, 
    NotEmpty, 
    PrimaryKey, 
    Table
 } from "sequelize-typescript";
import { MealPlanDateInterface } from "../../interface";
import { MealPlanBfDBModel } from "./mealplan-bf-db.model";
import { MealPlanDBModel } from "./mealplan-db.model";
import { MealPlanDinnerDBModel } from "./mealplan-dinner-db.model";
import { MealPlanEsDBModel } from "./mealplan-es-db.model";
import { MealPlanLunchDBModel } from "./mealplan-lunch-db.model";
import { MealPlanMsDBModel } from "./mealplan-ms-db.model";


@Table({
    tableName: "mealplan_date",
    timestamps: false,
})
export class MealPlanDateDBModel extends Model implements MealPlanDateInterface{

    @PrimaryKey
    @AutoIncrement
    @Column
    mealplan_date_id: number;

    @ForeignKey(() => MealPlanDBModel)
    @Column
    meal_plan_id: number;

    @AllowNull
    @NotEmpty
    @Column
    meal_plan_date: Date;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;

    @BelongsTo(() => MealPlanDBModel, 'meal_plan_id')
    meal_plan: MealPlanDBModel[];

    @HasMany(() => MealPlanBfDBModel, 'mealplan_date_id')
    breakFast: MealPlanBfDBModel[];
  
    @HasMany(() => MealPlanEsDBModel, 'mealplan_date_id')
    eveningSnacks: MealPlanEsDBModel[];
  
    @HasMany(() => MealPlanLunchDBModel, 'mealplan_date_id')
    lunch: MealPlanLunchDBModel[];
  
    @HasMany(() => MealPlanMsDBModel, 'mealplan_date_id')
    morningSnacks: MealPlanMsDBModel[];
  
    @HasMany(() => MealPlanDinnerDBModel, 'mealplan_date_id')
    dinner: MealPlanDinnerDBModel[];
}