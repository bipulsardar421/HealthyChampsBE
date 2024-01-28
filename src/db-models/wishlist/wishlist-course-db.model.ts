import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

import { ParentInfoDBModel } from "../parent-info-db.model";
import { CourseInfoDBModel } from "../course/course-info-db.model";
import { WishlistCourseInterface } from "../../interface";



@Table({
    tableName: "wishlist_course",
    timestamps: true,
})
export class WishlistCourseDBModel extends Model implements WishlistCourseInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    wishlist_course_id: number;

    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;

    @AllowNull(false)
    @ForeignKey(() => CourseInfoDBModel)
    @Column
    course_info_id: number;

    @AllowNull(true)
    @Default("active")
    @Column
    status: string;

    @BelongsTo(() => CourseInfoDBModel)
    courseInfo: CourseInfoDBModel;
}