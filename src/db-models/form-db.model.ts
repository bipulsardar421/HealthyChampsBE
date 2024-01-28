import {
    AllowNull,
    AutoIncrement,
    Column,
    Default,
    Model,
    NotEmpty,
    PrimaryKey,
    Sequelize,
    Table,
  } from "sequelize-typescript";
  import { decrypted, encrypted, sequelize } from "../helper";
  import { FormInterface } from "../interface";
  
  @Table({
    tableName: "form",
    timestamps: true,
  })
  export class FormDBModel extends Model implements FormInterface {
  
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    form_id: number;
    
    @AllowNull(true)
    @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
            FormDBModel.findOne({
             where:{
              $and: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('form')),
              Sequelize.fn('lower', value)
             ),
             status:'active'
              }
            })
            .then((data) => {
              if(data) {
               return next('Form is already present.')
  
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )

   form: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
  
  }
   
   