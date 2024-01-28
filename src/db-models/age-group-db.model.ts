
import { AllowNull, AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { decrypted, encrypted, sequelize } from "../helper";
import { AgeGroupInterface } from "../interface";
 
@Table({
    tableName: 'age_group',
    timestamps: true,
})
export class AgeGroupDBModel extends Model implements AgeGroupInterface {
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    age_group_id: number;
 
    @AllowNull(true)
    @Column(
        {
          unique: true,
          validate: {
             isUnique: function(value, next) {
                AgeGroupDBModel.findOne({
                  where: {
                    $and: Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('age_group')),
                    Sequelize.fn('lower', value)
                  ),
                  status: 'active'
                }   
              })
              .then((data) => {
                if(data) {
                 return next('Age Group is already present.')
    
                } else {
                  return next();
                }
              }).catch(error => next())
             }
          }
        }
      )
    age_group: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
    
}
