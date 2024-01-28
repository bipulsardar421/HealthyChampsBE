import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    NotEmpty,
    PrimaryKey,
    ForeignKey,
    Table,
    Default,
    HasMany,
    DataType,
    BelongsTo,
  } from "sequelize-typescript";
import { decrypted, encrypted, sequelize } from "../helper";
import {  FeedbackInterface } from "../interface";
import{ParentInfoDBModel} from "./parent-info-db.model";

  @Table({
    tableName: "feedback",
    timestamps: true,
  })
  export class FeedbackDBModel extends Model implements FeedbackInterface {
    
    @PrimaryKey
    @AutoIncrement
    @Column
    set feedback_id(value: string) {
      let val = '';
      if(value) {
         val = decrypted(this.getDataValue(value));
      } else {
        val = decrypted(this.getDataValue(value));
      }
      this.setDataValue("feedback_id", val);
    }
    get feedback_id(): any {
      let en = '';
      if(this.getDataValue("feedback_id")) {
        en = encrypted(this.getDataValue("feedback_id"));
      } else {
        en = this.getDataValue("feedback_id")
      }
      return en;
    }
  
   
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => ParentInfoDBModel)
    @Column    
    parent_id: number;
  
    @BelongsTo(() => ParentInfoDBModel, 'parent_id') 
    parent: ParentInfoDBModel;

    @AllowNull(true)
    @NotEmpty
    @Column
    error_reported: string;

    @AllowNull(true)
    @NotEmpty
    @Column
    suggestions_given: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;

        
  }
  