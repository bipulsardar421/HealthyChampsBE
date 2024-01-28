
import { AllowNull, AutoIncrement, Column, Default, Model, NotEmpty, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { decrypted, encrypted } from "../helper";
import { FoodCategoryInterface } from "../interface";

@Table({
  tableName: "food_category",
  timestamps: true,
})

export class FoodCategoryDBModel extends Model implements FoodCategoryInterface {
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    food_category_id: number;
   

    @AllowNull(false)
    @NotEmpty
    @Column(
    {
      unique: true,
      validate: {
         isUnique: function(value, next) {
          FoodCategoryDBModel.findOne({
            where: {
              $and: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('food_category')),
              Sequelize.fn('lower', value)
            ),
            status:'active'
              }
          })
          .then((data) => {
            if(data) {
             return next('Food Category is already present.')

            } else {
              return next();
            }
          }).catch(error => next())
         }
      }
    }
  )
  food_category: string;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;
}
