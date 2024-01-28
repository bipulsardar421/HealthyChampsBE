import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, NotEmpty, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { decrypted, encrypted } from "../helper";
import { CentreInterface } from "../interface";
import { CountryDBModel } from "./country.db.model";
 
@Table({
    tableName: 'centres',
    timestamps: true
})
export class CentreDBModel extends Model implements CentreInterface {
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    centre_id: number;

    @AllowNull(false)
    @NotEmpty
    @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
            CentreDBModel.findOne({
              where: {
                $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('centre_ID')),
                Sequelize.fn('lower', value)
              ),
              status:'active'
              }
            })
            .then((data) => {
              if(data) {
               return next('Centre ID is already present.')
  
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )
    centre_ID: string;

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => CountryDBModel)
    @Column
    country: number;
    
    @BelongsTo(() => CountryDBModel, 'country')
    countries: CountryDBModel

    @AllowNull(false)
    @NotEmpty
    @Column
    centre_name: string;
 
    @AllowNull(false)
    @NotEmpty
    @Column
    centre_location: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
    
}
