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
import { MealPlanBfInterface } from "../../interface";
import { RecipeInfoDBModel } from "../recipe/recipe-info-db.model";
import { MealPlanDateDBModel } from "./mealdate-db.model";
import { MealPlanDBModel } from "./mealplan-db.model";
import { RecipeViewDBModel } from "../recipe/recipe_view-db.model";
import { RecipeEditDBModel } from "../recipe/recipe-edit-db.model";
import { decrypted, encrypted } from "../../helper";

@Table({
    tableName: "meal_plan_bf",
    timestamps: false,
})
export class MealPlanBfDBModel extends Model implements MealPlanBfInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    breakfast_id: number;

    @AllowNull
    @NotEmpty
    @Column
    meal_plan_id: number;

    @AllowNull
    @NotEmpty
    @ForeignKey(() => RecipeEditDBModel)
    @Column
    recipe_info_id: number;
    // set recipe_info_id(value: string) {
    //     let val: number | undefined;
    //     if (value) {
    //       val = parseInt(decrypted(value));
    //     } else {
    //       val = undefined;
    //     }
    //     this.setDataValue("recipe_info_id", val);
    //   }
      
    // get recipe_info_id(): any {
    //     let en: any = '';
    //     if (this.getDataValue("recipe_info_id")) {
    //         en = this.getDataValue("recipe_info_id");
    //     } else {
    //         en = this.getDataValue("recipe_info_id")
    //     }
    //     return encrypted(en);
    // }

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