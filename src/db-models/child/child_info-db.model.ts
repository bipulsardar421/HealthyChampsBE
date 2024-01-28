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
// import { ChildInfoDBModel } from "./child-info-db.model";

@Table({
  tableName: "chiild_info",
  timestamps: true,
})
export class ChildInfoDBModel extends Model implements ChildInfoInterface {
 
  @PrimaryKey
  @AutoIncrement
  @Column
  set child_info_id(value: string) {
    let val: string | number = '';
    if (value) {
      val = parseInt(decrypted(value));
    } else {
      val = parseInt(this.getDataValue(value));
    }

    this.setDataValue("child_info_id", val);
  }
  get child_info_id(): any {
    let en = '';
    if (this.getDataValue("child_info_id")) {
      en = encrypted(this.getDataValue("child_info_id"));
    } else {
      en = this.getDataValue("child_info_id")
    }
    return en;
  }
  
  @AllowNull(false)
  @NotEmpty
  @ForeignKey(() => ParentInfoDBModel)
  @Column({
    type: DataType.BIGINT
  })
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

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @HasMany(() => ChildDietaryDBModel, 'child_info_id')
  dietary: ChildDietaryDBModel[]

  @HasMany(() => ChildAllergenDBModel, 'child_info_id')
  allergen: ChildAllergenDBModel[]

  @HasMany(() => ChildPreferenceDBModel, 'child_info_id')
  nutrition_category: ChildPreferenceDBModel[]

  @AfterCreate
  static getSubmittedData(instance: ChildInfoInterface) {
    return instance;
  }
 
  @BeforeValidate
  static validation(action: ChildInfoDBModel, options: any) {
    console.log(action)
}
}