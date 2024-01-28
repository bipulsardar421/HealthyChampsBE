import {
    AfterCreate,
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    NotEmpty,
    PrimaryKey,
    Sequelize,
    Table,
  } from "sequelize-typescript";
import { ChildInfoDBModel } from "./child_info-db.model";
import { NutritionCategoryDBModel } from "../nutrition-category-db.model";
import { ChildPreferenceInterface } from "../../interface";
 
   
  @Table({
    tableName: "child_info_prefrences",
    timestamps: false
  })
  export class ChildPreferenceDBModel extends Model implements ChildPreferenceInterface {
  
    @PrimaryKey
    @AutoIncrement
    @Column
    child_info_prefrences_id: number;

    @Column
    @ForeignKey(() => ChildInfoDBModel)
    child_info_id: number;

    @Column
    @ForeignKey(() => NutritionCategoryDBModel)
    nutrition_category_id: number;

    @BelongsTo(() => NutritionCategoryDBModel, 'nutrition_category_id')
    nutrition_details: NutritionCategoryDBModel[];
}