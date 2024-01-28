import { Sequelize } from "sequelize";
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
import { decrypted, encrypted, sequelize } from "../helper";
import { CountryInterface } from "../interface";

@Table({

    tableName: 'country',
    timestamps: true
})
export class CountryDBModel extends Model implements CountryInterface {

    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    country_id: number;
   
    @AllowNull(false)
    @NotEmpty
    @Column
    country_code: string;

    @AllowNull(false)
    @NotEmpty
    @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
            CountryDBModel.findOne({
              where:{
                $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('country_name')),
                Sequelize.fn('lower',value)
            ),
            status:'active'
                }
            })
            .then((data) => {
              if(data) {
               return next('Country Name is already present.')
  
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )
    country_name: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
    

}
