import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Sequelize, BelongsTo } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { CourseDesInterface } from "../../interface";
import { CourseInfoDBModel } from "./course-info-db.model";





@Table({
   tableName: 'course_des',
   timestamps: true
})
export class CourseDesDBModel extends Model implements CourseDesInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
   course_des_id: number;

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => CourseInfoDBModel)
    @Column
    course_info_id: number;
     
    @AllowNull(false)
    @NotEmpty
    @Column
    course_des: string;


    @AllowNull(true)
    @Default('active')
    @Column
    status: string;

    @BeforeValidate
      static validation(action: CourseDesDBModel, options: any) {
        console.log(action)
      }

  }
