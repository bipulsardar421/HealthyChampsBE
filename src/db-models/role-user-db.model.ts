import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
  } from "sequelize-typescript";
  import { decrypted, encrypted, sequelize } from "../helper";
  import { RoleUserInterface } from "../interface";
  
  @Table({
    tableName: "role_user",
    timestamps: false,
  })
  export class RoleUserDBModel extends Model implements RoleUserInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    set role_user_id(value: string) {
      const val = decrypted(this.getDataValue(value));
      this.setDataValue("role_user_id", val);
    }
    get role_user_id(): any {
      const en = encrypted(this.getDataValue("role_user_id"));
      return en;
    }
  
    @AllowNull(false)
    @NotEmpty
    @Column
    first_name: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    last_name: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    email_address: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    mobile_number: number;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    password: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    profile: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    centres: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    time_zone: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    user_role: string;
  }
  