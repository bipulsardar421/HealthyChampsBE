import { AutoIncrement, Column, PrimaryKey, Table, Model, AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Sequelize, BelongsTo, HasMany } from "sequelize-typescript";
import { decrypted, encrypted } from "../../../helper";
import { CourseSecInterface, } from "../../../interface";
import { CourseInfoDBModel } from "../course-info-db.model";
import { CourseSecTextDBModel} from "../..";

@Table({
    tableName: 'course_sec_info',
    timestamps: true
})
export class CourseSectionInfoDBModel extends Model implements CourseSecInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    set course_sec_id(value: string) {
        let val = '';
        if (value) {
            val = decrypted(this.getDataValue(value));
        } else {
            val = this.getDataValue(value);
        }

        this.setDataValue("course_sec_id", val);
    }
    get course_sec_id(): any {
        let en = '';
        if (this.getDataValue("course_sec_id")) {
            en = encrypted(this.getDataValue("course_sec_id"));
        } else {
            en = this.getDataValue("course_sec_id")
        }
        return en;
    }

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => CourseInfoDBModel)
    @Column
    course_info_id: number;

    @BelongsTo(() => CourseInfoDBModel, 'course_info_id')
    courseInfo: CourseInfoDBModel;

    @AllowNull(true)
    @NotEmpty
    @Column
    section_name: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
    
    @HasMany(() => CourseSecTextDBModel, 'course_sec_id')
    section_text: CourseSecTextDBModel[];
}