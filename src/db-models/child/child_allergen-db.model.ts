import {
    AfterCreate,
    AllowNull,
    AutoIncrement,
    BeforeCreate,
    BeforeValidate,
    BelongsTo,
    BelongsToAssociation,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    NotEmpty,
    PrimaryKey,
    Sequelize,
    Table,
  } from "sequelize-typescript";
  import { AgeGroupDBModel } from "../age-group-db.model";
  import { AllergenDBModel } from "../allergen-db.model";
  import { DietaryDBModel } from "../dietary-db.model";
  import { decrypted, encrypted, sequelize } from "../../helper";
import { ChildInfoDBModel } from "./child_info-db.model";
import { NutritionCategoryDBModel } from "../nutrition-category-db.model";
import { ChildAllergenInterface } from "../../interface";
 
   
  @Table({
    tableName: "child_info_allergen",
    timestamps: false
  })
  export class ChildAllergenDBModel extends Model implements ChildAllergenInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    child_info_allergen_id: number;

    @Column
    @ForeignKey(() => ChildInfoDBModel)
    child_info_id: number;

    @Column
    @ForeignKey(() => AllergenDBModel)
    allergen_id: number;

    @BelongsTo(() => AllergenDBModel, 'allergen_id')
    allergen_details: AllergenDBModel[];
}