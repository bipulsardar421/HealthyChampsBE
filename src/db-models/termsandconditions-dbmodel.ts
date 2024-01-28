
import { AllowNull, AutoIncrement, Column, Default, Model, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { decrypted, encrypted } from "../helper";
import {TermsandconditionsInterface } from "../interface";


@Table({
  tableName: "termsandconditions",
  timestamps: true,
})

export class TermsandconditionsDBModel extends Model implements TermsandconditionsInterface {
  @PrimaryKey
  @AutoIncrement
  @Column
  set termsandconditions_id(value: string) {
    let val = '';
    if(value) {
       val = decrypted(this.getDataValue(value));
    } else {
      val = this.getDataValue(value);
    }

    this.setDataValue("termsandconditions_id", val);
  }
  get termsandconditions_id(): any {
    let en = '';
    if(this.getDataValue("termsandconditions_id")) {
      en = encrypted(this.getDataValue("termsandconditions_id"));
    } else {
      en = this.getDataValue("termsandconditions_id")
    }
     return en;
  } 
    // @PrimaryKey
    // @AllowNull(true)
    // @AutoIncrement
    // @Column
    // termsandconditions_id: number;
   
 
    @AllowNull(true)
    @Column
    //   {
    //     unique: true,
    //     validate: {
    //        isUnique: function(value, next) {
    //         TermsandconditionsDBModel.findOne({
    //           where: Sequelize.where(
    //             Sequelize.fn('lower', Sequelize.col('termsandconditions_name')),
    //             Sequelize.fn('lower', value)
    //           )
    //           })
    //         .then((data) => {
    //           if(data) {
    //            return next('terms and conditions is already present.')
  
    //           } else {
    //             return next();
    //           }
    //         }).catch(error => next())
    //        }
    //     }
    //   }
    // )
    termsandconditions_name: string;
    
    @AllowNull(true)
    @Column
    applicable_for: string;
    
    @AllowNull(true)
    @Column
    content: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
}

