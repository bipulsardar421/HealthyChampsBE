import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate } from "sequelize-typescript";
import { CourseImageInterface } from "../../interface/course/course-image.interface";
import { decrypted, encrypted } from "../../helper";
import { CourseInfoDBModel } from "./course-info-db.model";
import { ConfigManager } from "../../config";



@Table({
   tableName: 'course_image',
   timestamps: true
})
export class CourseImageDBModel extends Model implements CourseImageInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    course_image_id: number;
   
    
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>CourseInfoDBModel)
    @Column
    course_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    set icon_image(image) {
        this.setDataValue('icon_image',image)
    }
    get icon_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/course/'+this.getDataValue("icon_image") 
    }

    @AllowNull(true)
    @NotEmpty
    @Column
    set thumbnail_image(image) {
        this.setDataValue('thumbnail_image',image)
    }
    get thumbnail_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/course/'+this.getDataValue("thumbnail_image") 
    }


    @AllowNull(true)
    @NotEmpty
    @Column
    set banner_image(image) {
        this.setDataValue('banner_image',image)
    }
    get banner_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/course/'+this.getDataValue("banner_image") 
    }

    @AllowNull(true)
    @NotEmpty
    @Column
    set course_main_image(image) {
        this.setDataValue('course_main_image',image)
    }
    get course_main_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/course/'+this.getDataValue("course_main_image") 
    }

    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 

  }