import {
    AfterCreate,
      AllowNull,
      AutoIncrement,
      BeforeValidate,
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
import { decrypted, encrypted } from "../helper";
  import { SubscriptionAppInterface } from "../interface";
import { ParentInfoDBModel } from "./parent-info-db.model";

    
    @Table({
      tableName: "subscription_app",
      timestamps: true,
    })
    export class SubscriptionAppDBModel extends Model implements SubscriptionAppInterface {
      
      @PrimaryKey
      @AutoIncrement
      @Column
      set subscription_app_id(value: number) {
        let val = '';
        if(value) {
           val = decrypted(this.getDataValue(value));
        } else {
          val = decrypted(this.getDataValue(value));
        }
    
        this.setDataValue("subscription_app_id", val);
      }
      get subscription_app_id(): any {
        let en = '';
        if(this.getDataValue("subscription_app_id")) {
          en = encrypted(this.getDataValue("subscription_app_id"));
        } else {
          en = this.getDataValue("subscription_app_id")
        }
       
        return en;
      }
      @AllowNull(true)
      @NotEmpty
      @ForeignKey(() => ParentInfoDBModel)
      @Column
      parent_id: number;

      @AllowNull(false)
      @NotEmpty
      @Column
      user_name: string;
  
      @AllowNull(false)
      @NotEmpty
      @Column
      periodicity: string;
  
      @AllowNull(false)
      @NotEmpty
      @Column
      from_date: Date;
  
      @AllowNull(false)
      @NotEmpty
      @Column
      to_date: Date;
  
  
      @AllowNull(false)
      @NotEmpty
      @Column
      cost: number;

      @AllowNull(true)
      @Default('active')
      @Column
      status: string;

      
      @BeforeValidate
      static validation(action: SubscriptionAppDBModel, options: any) {
        console.log(action)
      }
    }
    
  
  