import { Op } from "sequelize"
import {  Sequelize,AllowNull,NotEmpty,AfterCreate, AutoIncrement, BelongsTo, Column, Default, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript"
import { UserRoleInterface } from "../interface"
import { UserRolesFuncDBModel } from "./user-role-func-db.model"

@Table({
    tableName: 'user_Role',
    timestamps: true
})
export class UserRolesDBModel extends Model implements UserRoleInterface {


    @PrimaryKey
    @AllowNull(false)
    @NotEmpty
    @AutoIncrement
    @Column
    role_id: number

    @AllowNull(true)
    @Column(
      {
        unique: true,
        validate: {
          isUnique: function (value, next) {
            console.log(this.getDataValue('role_id'));
            UserRolesDBModel.findOne({
              where: {
                $and: Sequelize.where(
                  Sequelize.fn('lower', Sequelize.col('role_name')),
                  Sequelize.fn('lower', value)
                ),
                status: 'active',
                role_id: {[Op.ne]: this.getDataValue('role_id')}
              }
            })
              .then((data) => {
                if (data !== null) {
                  return next('User Name is already present.')
  
                } else {
                  return next();
                }
              }).catch(error => next())
          }
        }
      }
    )
    role_name: string

    @Default('active')
    @AllowNull(true)
    @Column
    status: string

  
    @HasMany(() => UserRolesFuncDBModel, 'role_id')
    user_roles_func: UserRolesFuncDBModel[]

 
    @AfterCreate
    static getSubmittedData(instance: UserRoleInterface) {
        return instance;
    }
}


