import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
  } from "sequelize-typescript";
import { SubscriptionInterface } from "../interface";
import { decrypted, encrypted } from "../helper";
import { DateOnlyDataType, IntegerDataType } from "sequelize";
  
  @Table({
    tableName: "subscription",
    timestamps: true,
  })
  export class SubscriptionDBModel extends Model implements SubscriptionInterface {
    
    @PrimaryKey
    @AutoIncrement
    @Column
    set subscription_id(value: string) {
      let val = '';
      if(value) {
         val = decrypted(this.getDataValue(value));
      } else {
        val = this.getDataValue(value);
      }
  
      this.setDataValue("subscription_id", val);
    }
    get subscription_id(): any {
      let en = '';
      if(this.getDataValue("subscription_id")) {
        en = encrypted(this.getDataValue("subscription_id"));
      } else {
        en = this.getDataValue("subscription_id")
      }
       return en;
    } 

    @AllowNull(false)
    @NotEmpty
    @Column
    periodicity: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    cost: number;
    
    @AllowNull(true)
    @NotEmpty
    @Default('active')
    @Column
    status: string;

  }
  

