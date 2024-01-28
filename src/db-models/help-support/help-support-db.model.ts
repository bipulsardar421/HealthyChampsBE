import {
    AfterCreate,
      AllowNull,
      AutoIncrement,
      BeforeValidate,
      Column,
      Default,
      Model,
      NotEmpty,
      PrimaryKey,
      Table,
    } from "sequelize-typescript";
  import { decrypted, encrypted } from "../../helper";
  import { HelpandSupportInterface } from "../../interface"

    
    @Table({
      tableName: "help_and_support",
      timestamps: true,
    })
    export class HelpandSupportDBModel extends Model implements HelpandSupportInterface {
      
      @PrimaryKey
      @AutoIncrement
      @Column
      set help_support_id(value: string) {
        let val: string | number  = '';
        if(value) {
           val = decrypted(this.getDataValue(value));
        } else {
          val = decrypted(this.getDataValue(value));
        }
    
        this.setDataValue("help_support_id", val);
      }
      get help_support_id(): any {
        let en = '';
        if(this.getDataValue("help_support_id")) {
          en = encrypted(this.getDataValue("help_support_id"));
        } else {
          en = this.getDataValue("help_support_id")
        }
       
        return en;
      }
      @AllowNull(false)
      @NotEmpty
      @Column
      country_code: string;
  
      @AllowNull(false)
      @NotEmpty
      @Column
      phone_number: string;
  
      @AllowNull(false)
      @NotEmpty
      @Column
      email_address: string;

      @AllowNull(true)
      @Default('active')
      @Column
      status: string;
     
    }
    
  
  