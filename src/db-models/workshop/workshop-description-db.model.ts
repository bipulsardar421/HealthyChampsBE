import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Sequelize, BelongsTo } from "sequelize-typescript";
import { WorkshopDescriptionInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { WorkshopInfoDBModel } from "./workshop-info-db.model";

@Table({
   tableName: 'workshop_des',
   timestamps: true
})
export class WorkshopDescriptionDBModel extends Model implements WorkshopDescriptionInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    workshop_des_id: number;
    
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>WorkshopInfoDBModel)
    @Column
    workshop_info_id: number;
     
    @AllowNull(false)
    @NotEmpty
    @Column
    workshop_des: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;


  }