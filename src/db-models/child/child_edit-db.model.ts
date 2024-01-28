import { Op } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Default,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
  Sequelize,
  AfterCreate,
  BeforeValidate,
} from "sequelize-typescript";
import { decrypted, encrypted, sequelize } from "../../helper";
import { ChildInfoInterface } from "src/interface/child/child-info.interface";
import { ChildDietaryDBModel } from "./child_diatary-db.model";
import { ChildAllergenDBModel } from "./child_allergen-db.model";
import { ChildPreferenceDBModel } from "./child_preferences-db.model";
import { ParentInfoDBModel } from "../parent-info-db.model";
import { ChildEditInterface } from "../../interface/child/child-edit.interface";

@Table({
    tableName: "chiild_info",
    timestamps: false,
  })
  export class ChildEditDBModel extends Model implements ChildEditInterface {
   
    @PrimaryKey
    @AllowNull(true)
    @NotEmpty
    @Column
    child_info_id: number;
    
    
    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;

    @BelongsTo(() => ParentInfoDBModel, 'parent_id')
    parentInfo: ParentInfoDBModel;
    
    @AllowNull(false)
    @NotEmpty
    @Column
    date_of_birth: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    child_name: string;
  
    @HasMany(() => ChildDietaryDBModel, 'child_info_id')
    dietary: ChildDietaryDBModel[]
  
    @HasMany(() => ChildAllergenDBModel, 'child_info_id')
    allergen: ChildAllergenDBModel[]
  
    @HasMany(() => ChildPreferenceDBModel, 'child_info_id')
    nutrition_category: ChildPreferenceDBModel[];
  
    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
      
  }