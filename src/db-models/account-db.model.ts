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
  import { AccountInterface } from "../interface";
  
  @Table({
    tableName: "account_update",
    timestamps: false,
  })
  export class AccountDBModel extends Model implements AccountInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    set account_id(value: string) {
      const val = decrypted(this.getDataValue(value));
      this.setDataValue("account_id", val);
    }
    get account_id(): any {
      const en = encrypted(this.getDataValue("accoun_id"));
      return en;
    }
  
    @AllowNull(false)
    @NotEmpty
    @Column
    organisation_name: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    organisation_address: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    billing_account_name: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    billing_account_number: number;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    billing_account_status: string;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    billing_address: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    billing_first_name: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    billing_last_name: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    billing_phone_number: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    billing_email_address: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    sales_first_name: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    sales_last_name: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    sales_phone_number: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    sales_email_address: string;
  }
  