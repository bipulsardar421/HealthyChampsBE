import {  AllowNull,Sequelize,NotEmpty,AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserRoleFuncInterface } from "src/interface";
import { UserRolesDBModel } from "./user-role-db.model";

@Table({
    tableName: 'user_role_functionality',
    timestamps: true
})
export class UserRolesFuncDBModel extends Model implements UserRoleFuncInterface {
    
    @AutoIncrement
    @AllowNull(false)
    @NotEmpty
    @PrimaryKey
    @Column
    id: number;

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => UserRolesDBModel)
    @Column
    role_id: number;

    @BelongsTo(() => UserRolesDBModel, 'role_id')
    User_role_ids: UserRolesDBModel

    @AllowNull(true)
    @NotEmpty
    @Column
    module: string;

    @AllowNull(true)
    @NotEmpty
    @Column(DataType.ARRAY(DataType.STRING))
    access_fun: string[];
    
    @AllowNull(true)
    @NotEmpty
    @Default('active')
    @Column
    status: string;
}
