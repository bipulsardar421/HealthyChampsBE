
import { AllowNull, AutoIncrement, Column, Default, Model, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { decrypted, encrypted } from "../helper";
import { SupplierInterface } from "../interface";
import { Op } from "sequelize";


@Table({
  tableName: "supplier",
  timestamps: true,
})

export class SupplierDBModel extends Model implements SupplierInterface {
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column
    supplier_id: number;
   
 
    @AllowNull(true)
    @Column(
      {
        unique: true,
        validate: {
           isUnique: function(value, next) {
            SupplierDBModel.findOne({
              where: {
                $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('supplier')),
                Sequelize.fn('lower', value)
              ),
              status:'active',
              supplier_id: {[Op.ne]: this.getDataValue('supplier_id')}
              }
            })
            .then((data) => {
              if(data !== null) {
               return next('Supplier is already present.')
  
              } else {
                return next();
              }
            }).catch(error => next())
           }
        }
      }
    )
    supplier: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
}

