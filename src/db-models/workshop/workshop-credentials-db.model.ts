import {
  AllowNull,
  AutoIncrement,
  BeforeValidate,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { WorkshopCredentialsInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { WorkshopInfoDBModel } from "./workshop-info-db.model";

@Table({
  tableName: "workshop_credentials",
  timestamps: true,
})
export class WorkshopCredentialsDBModel extends Model implements WorkshopCredentialsInterface {
 
  @PrimaryKey
  @AutoIncrement
  @Column
  workshop_credentials_id: number;
  
  @AllowNull(true)
  @NotEmpty
  @Column
  @ForeignKey(() =>WorkshopInfoDBModel)
  workshop_info_id: number;

  @AllowNull(true)
  @Column
  meeting_link: string;


  @AllowNull(true)
  @Column
  meeting_id: string;
 
  @AllowNull(true)
  @Column
  passcode: string;


  @AllowNull(true)
  @Column
  location: string;


  @AllowNull(false)
  @Default('active')
  @Column
  status: string;


  @BeforeValidate
    static validation(action: WorkshopCredentialsDBModel, options: any) {
      console.log(action)
    }
}







