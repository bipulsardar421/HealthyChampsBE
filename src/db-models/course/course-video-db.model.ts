import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default } from "sequelize-typescript";
import { CourseVideoInterface } from "../../interface";
import { CourseInfoDBModel } from "./course-info-db.model";
import { ConfigManager } from "../../config";


@Table({
   tableName: 'course_video',
   timestamps: true
})

export class CourseVideoDBModel extends Model implements CourseVideoInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    course_video_id: number;
   
    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() =>CourseInfoDBModel)
    @Column
    course_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    set video(video) {
        this.setDataValue('video',video)
    }
    get video(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-video/course/'+this.getDataValue("video") 
    }

    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 
}