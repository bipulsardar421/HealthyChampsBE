import { AllowNull, AutoIncrement, Column, ForeignKey, Default, Model, NotEmpty, PrimaryKey, Table } from "sequelize-typescript";
import { WorkshopInfoDBModel } from "./workshop-info-db.model";
import { ConfigManager } from "../../config";
import { WorkshopVideoInterface } from "../../interface";

@Table({
    tableName: 'workshop_video',
    timestamps: true
 })

 export class WorkshopVideoDBModel extends Model implements WorkshopVideoInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    workshop_video_id: number;

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() =>WorkshopInfoDBModel)
    @Column
    workshop_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    // video: string;
    set video(video) {
        this.setDataValue('video',video)
    }
    get video(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-video/workshop/'+this.getDataValue("video") 
    }

    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 

 }