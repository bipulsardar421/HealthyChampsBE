import {AfterCreate,AllowNull,AutoIncrement,BeforeValidate,BelongsTo,BelongsToMany,Column,DataType,Default,ForeignKey,HasMany,Model,NotEmpty,PrimaryKey, Sequelize,Table,} from "sequelize-typescript";
import { HelpEditInterface } from "../../interface/help-support/help-edit.interface";

  
  @Table({
    tableName: "help_and_support",
    timestamps: false,
  })
  
  export class HelpEditDBModel extends Model implements HelpEditInterface {
    @PrimaryKey
    @AllowNull(true)
    @NotEmpty
    @Column
    help_support_id: number;
  
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
  
  
  