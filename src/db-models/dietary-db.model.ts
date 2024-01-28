import { notEqual } from "assert";
import { Op, Sequelize } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { decrypted, encrypted, sequelize } from "../helper";
import { DietaryInterface } from "../interface";
import {RecipeDietaryDBModel } from "./recipe/recipe-dietary-db.model";

@Table({
  tableName: "dietary",
  timestamps: true,
})
export class DietaryDBModel extends Model implements DietaryInterface {

  @PrimaryKey
  @AllowNull(true)
  @AutoIncrement
  @Column
  dietary_id: number;
  
  @AllowNull(false)
  @NotEmpty
  @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
              DietaryDBModel.findOne({
              where: {
                $and: Sequelize.where(
                  Sequelize.fn('lower', Sequelize.col('dietary')),
                  Sequelize.fn('lower', value)
                ),
                status: 'active',
                dietary_id: {[Op.ne]: this.getDataValue('dietary_id')}
              
              }
            })
            .then((data) => {
              if(data !== null) {
               return next('Dietary is already present.')
  
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )
    dietary: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    abbreviation: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    glossary: string;
    
    @AllowNull(true)
    @Default('active')
    @Column
    status: string;

    @HasMany(() => RecipeDietaryDBModel, 'dietary_id')
    recipe_dietary: RecipeDietaryDBModel[];


}
 
