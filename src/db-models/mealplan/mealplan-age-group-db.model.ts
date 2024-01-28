import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MealAgeGroupInterface, RecipeAgeGroupInterface } from "../../interface";
import { AgeGroupDBModel } from "../age-group-db.model";
import { MealPlanDBModel } from "./mealplan-db.model";

@Table({
    tableName: 'mealplan_age_group',
    timestamps: false
})
export class MealAgeGroupDBModel extends Model implements MealAgeGroupInterface{
   
    @PrimaryKey
    @AutoIncrement
    @Column
    mealplan_age_group_id: number;

    @Column
    @ForeignKey(() => MealPlanDBModel)
    meal_plan_id: number;

    @Column
    @ForeignKey(() => AgeGroupDBModel)
    age_group_id: number;

    @BelongsTo(() => AgeGroupDBModel, 'age_group_id')
    age_group_details: AgeGroupDBModel[];
    
}