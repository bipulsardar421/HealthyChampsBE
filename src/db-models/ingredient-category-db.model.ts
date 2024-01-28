import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
} from "sequelize-typescript";
import { decrypted, encrypted } from "../helper";
import { IngredientCategoryInterface } from "../interface";
import { IngredientDBModel } from "./ingredient-db.model";

@Table({
  tableName: "ingredient_category",
  timestamps: true,
 })
export class IngredientCategoryDBModel 
  extends Model
  implements IngredientCategoryInterface
{
  @PrimaryKey
  @AllowNull(true)
  @AutoIncrement
  @Column
  ingredient_category_id: number;
  

  @AllowNull(true)
  @Column(
    {
      unique: true,
      validate: {
         isUnique: function(value, next) {
          IngredientCategoryDBModel.findOne({
            where: {
             $and: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('ingredient_category')),
              Sequelize.fn('lower', value)
            ),
            status:'active'
             }
        })
          .then((data) => {
            if(data) {
             return next('Ingredient Category is already present.')

            } else {
              return next();
            }
          }).catch(error => next())
         }
      }
    }
  )
  ingredient_category: string;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;
}
