import { AutoIncrement, Column, PrimaryKey, Table, Model, AllowNull, ForeignKey, NotEmpty, Default, BeforeValidate, BelongsTo } from "sequelize-typescript";
import { CourseSecTextInterface } from "../../../interface";
import { decrypted, encrypted } from "../../../helper";
import {CourseSectionInfoDBModel } from "../..";

@Table({
  tableName: 'course_sec_text',
  timestamps: true
})
export class CourseSecTextDBModel extends Model implements CourseSecTextInterface {
  @PrimaryKey
  @AutoIncrement
  @Column
  set sec_text_id(value: string) {
    let val = '';
    if (value) {
      val = decrypted(this.getDataValue(value));
    } else {
      val = this.getDataValue(value);
    }
    this.setDataValue("sec_text_id", val);
  }
  get sec_text_id(): any {
    let en = '';
    if (this.getDataValue("sec_text_id")) {
      en = encrypted(this.getDataValue("sec_text_id"));
    } else {
      en = this.getDataValue("sec_text_id")
    }
    return en;
  }
  @AllowNull(true)
  @NotEmpty
  @ForeignKey(() => CourseSectionInfoDBModel)
  @Column
  course_sec_id: number;

  @AllowNull(true)
  @NotEmpty
  @Column
  section_description: string;

}




