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
import { AllergenInterface } from "../interface";

@Table({

    tableName: 'allergen',
    timestamps: true
})
export class AllergenDBModel extends Model implements AllergenInterface {

    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    allergen_id: number;
   

    @AllowNull(false)
    @NotEmpty
    @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
            AllergenDBModel.findOne({
              where:{
             $and:Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('allergen')),
                Sequelize.fn('lower',value)
            ),
            status: 'active'
            }
            })
            .then((data) => {
              if(data) {
               return next('Allergen is already present.')
  
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )
    allergen: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
    

}
