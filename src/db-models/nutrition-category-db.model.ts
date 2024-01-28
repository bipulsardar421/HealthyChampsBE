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
  import { NutritionCategoryInterface } from "../interface/nutrition-category.interface";
 
  
  @Table({
    tableName: "nutrition_category",
    timestamps: true,
   })
  export class NutritionCategoryDBModel
    extends Model
    implements NutritionCategoryInterface
  {
    @PrimaryKey
    @AllowNull(null)
    @AutoIncrement
    @Column
    nutrition_category_id: number;
   
    @AllowNull(true)
    @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
            NutritionCategoryDBModel.findOne({
              where: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('nutrition_category')),
                Sequelize.fn('lower', value)
              )
            })
            .then((data) => {
              if(data) {
               return next('Nutrition Category is already present.')
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )
    nutrition_category: string;
  
    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
  }
  