import {
    AfterCreate,
    AllowNull,
    AutoIncrement,
    BeforeValidate,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    NotEmpty,
    PrimaryKey,
    Sequelize,
    Table,
  } from "sequelize-typescript";
import { CourseDesDBModel } from "./course-des-db.model";
import { CourseEditInterface } from "../../interface/course/course-edit.interface";
import { CourseImageDBModel } from "./course-image-db.model";
import { CourseVideoDBModel } from "./course-video-db.model";
import {CourseSectionInfoDBModel } from "..";


  @Table({
    tableName: "course_info",
    timestamps: false,
  })
  
  export class CourseEditDBModel extends Model implements CourseEditInterface {
    //   CourseInfo
    @PrimaryKey
    @AllowNull(true)
    @NotEmpty
    @Column
    course_info_id: number;
  
    @AllowNull(false)
    @NotEmpty
    @Column
    course_name: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    author: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    published_date: Date;

    @AllowNull(false)
    @NotEmpty
    @Column
    subscription_type: boolean;

    @AllowNull(false)
    @NotEmpty
    @Column
    no_of_sections: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    time_duration: string;
    
    // Description
  
    @HasMany(() => CourseDesDBModel, 'course_info_id')
    course_des: CourseDesDBModel;
    
   @HasMany(() => CourseSectionInfoDBModel, 'course_info_id')
   course_section: CourseSectionInfoDBModel;

    @HasMany(() => CourseImageDBModel, 'course_info_id')
    course_images: CourseImageDBModel;
  
    @HasMany(() => CourseVideoDBModel, 'course_info_id')
    course_videos: CourseVideoDBModel;

  
    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
  }
  
  
  