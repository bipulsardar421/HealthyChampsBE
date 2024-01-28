import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ServingsInterface } from "../interface";
import { decrypted, encrypted, sequelize } from "../helper";
import { FindAndCountOptions } from "sequelize";


@Table({
  tableName: "servings",
  timestamps: true
})
export class ServingsDBModel extends Model implements ServingsInterface {
    
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    servings_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    age_group: string;

    @AllowNull(true)
    @NotEmpty
    @Column
    no_of_students: number;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;

}
 
