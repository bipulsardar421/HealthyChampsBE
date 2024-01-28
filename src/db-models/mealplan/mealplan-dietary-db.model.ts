import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MealDietaryInterface, RecipeDietaryInterface } from "../../interface";
import { DietaryDBModel } from "../dietary-db.model";
import { MealPlanDBModel } from "./mealplan-db.model";


@Table({
    tableName: 'mealplan_dietary',
    timestamps: false
})
export class MealDietaryDBModel extends Model implements MealDietaryInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    mealplan_dietary_id: number;

    @Column
    @ForeignKey(() => MealPlanDBModel)
    meal_plan_id: number;

    @Column
    @ForeignKey(() => DietaryDBModel)
    dietary_id: number;

    @BelongsTo(() => DietaryDBModel, 'dietary_id')
    dietary_details: DietaryDBModel[]
}