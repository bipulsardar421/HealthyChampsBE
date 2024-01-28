
import {
  AfterCreate,
  AllowNull,
  AutoIncrement,
  BeforeValidate,
  Column,
  HasMany,
  DataType,
  Default,
  Model,
  NotEmpty,
  PrimaryKey,
  Sequelize,
  Table,
} from "sequelize-typescript";
import { decrypted, encrypted } from "../helper";
import { MeasurementCountryInterface, MeasurementInterface } from "../interface";
import { Op } from "sequelize";
import { MeasurementCountryDBModel } from "./measurement-country-db.model";
  
  @Table({
  
      tableName: 'measurement',
      timestamps: true,
  })
  export class MeasurementDBModel extends Model implements MeasurementInterface {
  
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    measurement_id: number;
  
      @AllowNull(true)
      @Column(
        {
          unique: true,
          validate: {
             isUnique: function(value, next) {
              console.log(this.getDataValue('measurement_id'));
              MeasurementDBModel.findOne({
               where: {
                $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('measurement_name')),
                Sequelize.fn('lower', value)
              ),
              status: 'active',
              measurement_id: { [Op.ne]: this.getDataValue('measurement_id') }
            }
          })
            .then((data) => {
              if (data !== null) {
                return next('Measurement is already present.')

              } else {
                return next();
              }
            }).catch(error => next())
        }
      }
    }
  )
  measurement_name: string;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @HasMany(() => MeasurementCountryDBModel, 'measurement_id')
  country_names: MeasurementCountryDBModel[]

  @AfterCreate
  static getSubmittedData(instance: MeasurementInterface) {
    return instance;
  }

  @BeforeValidate
  static validation(action: MeasurementDBModel, options: any) {
    console.log(action)
  }


}
