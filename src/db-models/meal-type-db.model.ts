import {
    AllowNull,
    AutoIncrement,
    Column,
    Default,
    HasMany,
    Model,
    PrimaryKey,
    Sequelize,
    Table,
  } from "sequelize-typescript";
import { decrypted, encrypted } from "../helper";
  import { MealTypeInterface } from "../interface";
import { RecipeEditDBModel } from "./recipe/recipe-edit-db.model";
  
  @Table({
    tableName: "meal_type",
    timestamps: true,
  })
  export class MealTypeDBModel
    extends Model
    implements MealTypeInterface
  {
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    meal_type_id: number;
   
  
    @AllowNull(true)
    @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
            MealTypeDBModel.findOne({
              where: {
                $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('meal_type')),
                Sequelize.fn('lower', value)
              ),
              status:'active'
                }
            })
            .then((data) => {
              if(data) {
               return next('Meal Type is already present.')
  
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )
    meal_type: string;
   
//   @HasMany(() => RecipeEditDBModel)
// recipes: RecipeEditDBModel[];


  @AllowNull(true)
  @Default('active')
  @Column
  status: string;
  }
  