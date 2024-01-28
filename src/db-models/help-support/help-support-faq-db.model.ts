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
  import { HelpFAQInterface, HelpandSupportInterface } from "../../interface";

    
    @Table({
      tableName: "faq",
      timestamps: true,
    })
    export class HelpFAQDBModel extends Model implements HelpFAQInterface {
      
      @PrimaryKey
      @AutoIncrement
      @Column
      set faq_id(value: string) {
        let val: string | number  = '';
        if(value) {
           val = decrypted(this.getDataValue(value));
        } else {
          val = decrypted(this.getDataValue(value));
        }
    
        this.setDataValue("faq_id", val);
      }
      get faq_id(): any {
        let en = '';
        if(this.getDataValue("faq_id")) {
          en = encrypted(this.getDataValue("faq_id"));
        } else {
          en = this.getDataValue("faq_id")
        }
       
        return en;
      }
      
      @AllowNull(false)
      @NotEmpty
      @Column
      faq_title: string;
  
      @AllowNull(false)
      @NotEmpty
      @Column
      faq_description: string;
  
      @AllowNull(true)
      @Default('active')
      @Column
      status: string;
     
    }
    
  
  