import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Sequelize, BelongsTo } from "sequelize-typescript";
import { PodcastsDesInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { PodcastsInfoDBModel } from "./podcasts-info-db.model";

@Table({
   tableName: 'podcasts_des',
   timestamps: true
})
export class PodcastsDesDBModel extends Model implements PodcastsDesInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    podcasts_des_id: number;
    
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>PodcastsInfoDBModel)
    @Column
    podcasts_info_id: number;
     
    @AllowNull(false)
    @NotEmpty
    @Column
    podcasts_des: string;


    @AllowNull(true)
    @Default('active')
    @Column
    status: string;


  }