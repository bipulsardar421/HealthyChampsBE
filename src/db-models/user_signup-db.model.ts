
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { decrypted, encrypted, sequelize } from "../helper";
import { UserSignUpInterface } from "../interface";
import { CentreDBModel } from "./centre-db.model";
import { CountryDBModel } from "./country.db.model";
import { UserRolesDBModel } from "./user-role-db.model";

@Table({
  tableName: "user_signup_role",
  timestamps: true,
})
export class UserSignUpDBModel extends Model implements UserSignUpInterface {
  

  @PrimaryKey
  @AutoIncrement
  @Column
  set user_signup_id(value: string) {
    let val = '';
    if (value) {
      val = decrypted(this.getDataValue(value));
    } else {
      val = this.getDataValue(value);
    }
    this.setDataValue("user_signup_id", val);
  }
  get user_signup_id(): any {
    let en = '';
    if (this.getDataValue("user_signup_id")) {
      en = encrypted(this.getDataValue("user_signup_id"));
    } else {
      en = this.getDataValue("user_signup_id")
    }
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
  mobile_number: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  password: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  temp_pass: boolean;

  @AllowNull(true)
  @NotEmpty
  @Column
  timezone: Date;

  @AllowNull(false)
  @NotEmpty
  @ForeignKey(() => UserRolesDBModel)
  @Column({
      type: DataType.BIGINT
   })
  role_id: number;
    
  @BelongsTo(() => UserRolesDBModel, 'role_id')
  userroles: UserRolesDBModel

  @AllowNull(true)
  @NotEmpty
  @ForeignKey(() => CountryDBModel)
  @Column
  country: number;
    
  @BelongsTo(() => CountryDBModel, 'country')
  countries: CountryDBModel[]

  // @AllowNull(false)
  // @NotEmpty
  // @ForeignKey(() => CentreDBModel)
  // @Column({
  //   type: DataType.INTEGER
  // })
  // center: number;

  // @BelongsTo(() => CentreDBModel, 'center')
  // centres: CentreDBModel[]

  @AllowNull(true)
  @NotEmpty
  @Default('active')
  @Column
  status: string;
  
}
