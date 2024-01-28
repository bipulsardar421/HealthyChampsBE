import { Op } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Default,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
  Sequelize,
} from "sequelize-typescript";
import { decrypted, encrypted, sequelize } from "../helper";
import { ParentInfoInterface } from "../interface";
import { CountryDBModel } from "./country.db.model";
import { CentreDBModel } from "./centre-db.model";
import { ChildInfoDBModel } from "./child/child_info-db.model";
import { ParentProfileImageDBModel } from "./parent-image-db.model";
// import { ChildInfoDBModel } from "./child-info-db.model";

@Table({
  tableName: "parent_info",
  timestamps: true,
})
export class ParentInfoDBModel extends Model implements ParentInfoInterface {

  @PrimaryKey
  @AllowNull(true)
  @AutoIncrement
  @Column
  set parent_id(value: string) {
    let val: string | number = '';
    if (value) {
      val = decrypted(this.getDataValue(value));
    } else {
      val = this.getDataValue(value);
    }
    this.setDataValue("parent_id", val);
  }
  get parent_id(): any {
    let en = '';
    if (this.getDataValue("parent_id")) {
      en = encrypted(this.getDataValue("parent_id"));
    } else {
      en = this.getDataValue("parent_id")
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

  @AllowNull(true)
  @Column(
    {
      unique: true,
      validate: {
        isUnique: function (value, next) {
          console.log(this.getDataValue('parent_id'));
          ParentInfoDBModel.findOne({
            where: {
              $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('email_address')),
                Sequelize.fn('lower', value)
              ),
              status: 'active',
              parent_id: { [Op.ne]: this.getDataValue('parent_id') }
            }
          })
            .then((data) => {
              if (data !== null) {
                return next('Email Address is already present.')

              } else {
                return next();
              }
            }).catch(error => next())
        }
      }
    }
  )
  email_address: string;

  @AllowNull(true)
  @NotEmpty
  @ForeignKey(() => CountryDBModel)
  @Column({
    type: DataType.INTEGER
  })
  country: number;

  @BelongsTo(() => CountryDBModel, 'country')
  countries: CountryDBModel

  @AllowNull(true)
  @NotEmpty
  @ForeignKey(() => CountryDBModel)
  @Column
  country_code: number;

  @AllowNull(true)
  @Column
  mobile_number: string;

  @AllowNull(true)
  @ForeignKey(() => CentreDBModel)
  @Column({
    type: DataType.INTEGER
  })
  centre: number;

  @BelongsTo(() => CentreDBModel, 'centre')
  centers: CentreDBModel;

  @NotEmpty
  @Column
  password: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  login_orgin: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  temp_pass: boolean;

  @AllowNull(false)
  @NotEmpty
  @Column
  existing_parent: boolean;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @HasMany(() => ParentProfileImageDBModel, 'parent_id')
  parent_image: ParentProfileImageDBModel

  @HasMany(() => ChildInfoDBModel, 'parent_id')
  children: ChildInfoDBModel[];
}
