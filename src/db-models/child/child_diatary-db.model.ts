import {
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
  import { DietaryDBModel } from "../dietary-db.model";
  import { ChildInfoDBModel } from "./child_info-db.model";
  import { ChildDietaryInterface } from "../../interface";
 
   
  @Table({
    tableName: "child_info_diatary",
    timestamps: false
  })
  export class ChildDietaryDBModel extends Model implements ChildDietaryInterface {
  
    @PrimaryKey
    @AutoIncrement
    @Column
    child_info_diatary_id: number;

    @Column
    @ForeignKey(() => ChildInfoDBModel)
    child_info_id: number;

    @Column
    @ForeignKey(() => DietaryDBModel)
    dietary_id: number;

    @BelongsTo(() => DietaryDBModel, 'dietary_id')
    dietery_details: DietaryDBModel[];
}