import { AutoIncrement, Column, PrimaryKey, Table, Model, AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Sequelize, BelongsTo, HasMany } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { CourseSecInterface, } from "../../interface";
import { CourseInfoDBModel } from "./course-info-db.model";
import { ParentInfoDBModel } from "../parent-info-db.model";
import { CourseSecTextDBModel, CourseSectionInfoDBModel } from "..";


@Table({
    tableName: 'course_section_mark_as_read',
    timestamps: true
})
export class CourseSectionMarDBModel extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column
    mar_id: number;


    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => CourseInfoDBModel)
    @Column
    course_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => CourseSectionInfoDBModel)
    @Column
    course_sec_id: number;


    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => CourseSecTextDBModel)
    @Column
    sec_text_id: number;

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    mark_as_read: boolean;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;


    @HasMany(() => CourseInfoDBModel, 'course_info_id')
    course_info: CourseInfoDBModel

    @HasMany(() => CourseSectionInfoDBModel, 'course_sec_id')
    sec_info: CourseSectionInfoDBModel

    @HasMany(() => CourseSecTextDBModel, 'sec_text_id')
    sec_text: CourseSecTextDBModel

    @HasMany(() => ParentInfoDBModel, 'parent_id')
    parent_info: ParentInfoDBModel





}
