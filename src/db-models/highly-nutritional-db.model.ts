import {
    AllowNull,
    AutoIncrement,
    Column,
    Default,
    Model,
    PrimaryKey,
    Sequelize,
    Table,
  } from "sequelize-typescript";
import { decrypted, encrypted } from "../helper";
  import { HighlyNutritionalInterface } from "../interface";
  
  @Table({
    tableName: "highly_nutritional",
    timestamps: true,
  })
  export class HighlyNutritionalDBModel extends Model implements HighlyNutritionalInterface
  {
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    highly_nutritional_id: number;
   
    
    @AllowNull(false)
    @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
            HighlyNutritionalDBModel.findOne({
              where:{
                $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('highly_nutritional')),
                Sequelize.fn('lower', value)
               ),
               status:'active'
                }
            })
            .then((data) => {
              if(data) {
               return next('Highly Nutritional Value is already present.')
  
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )
    highly_nutritional: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
  }