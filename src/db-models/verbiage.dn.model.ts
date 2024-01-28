import {
    AllowNull,
    AutoIncrement,
    Column,
    Default,
    Model,
    NotEmpty,
    PrimaryKey,
    Sequelize,
    Table,
  } from "sequelize-typescript";
  import { decrypted, encrypted, sequelize } from "../helper";
  import { VerbiageInterface } from "../interface";
  
  @Table({
    tableName: "verbiage",
    timestamps: true,
  })
  export class VerbiageDBModel extends Model implements VerbiageInterface {
  
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    verbiage_id: number;
    
    @AllowNull(false)
    @Column
    verbiage: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
  
  }
   
   