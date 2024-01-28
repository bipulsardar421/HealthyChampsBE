import {
  AfterCreate,
  AllowNull,
  AutoIncrement,
  BeforeValidate,
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
import { AgeGroupDBModel } from "../age-group-db.model";
import { AllergenDBModel } from "../allergen-db.model";
import { DietaryDBModel } from "../dietary-db.model";
import { CourseInfoInterface, RecipeInfoInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { HighlyNutritionalDBModel } from "../highly-nutritional-db.model";
import { MealTypeDBModel } from "../meal-type-db.model";
import { NutritionCategoryDBModel } from "../nutrition-category-db.model";
import { CourseImageDBModel } from "./course-image-db.model";
import { CourseVideoDBModel } from "./course-video-db.model";
import { CourseDesDBModel } from "./course-des-db.model";
import { CourseSectionInfoDBModel } from "..";

@Table({
  tableName: "course_info",
  timestamps: true,
})
export class CourseInfoDBModel extends Model implements CourseInfoInterface {

  @PrimaryKey
  @AutoIncrement
  @Column
  set course_info_id(value: number) {
    let val = '';
    if (value) {
      val = decrypted(this.getDataValue(value));
    } else {
      val = decrypted(this.getDataValue(value));
    }

    this.setDataValue("course_info_id", val);
  }
  get course_info_id(): any {
    let en = '';
    if (this.getDataValue("course_info_id")) {
      en = encrypted(this.getDataValue("course_info_id"));
    } else {
      en = this.getDataValue("course_info_id")
    }

    return en;
  }
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
  @Column
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

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @HasMany(() => CourseDesDBModel, 'course_info_id')
  course_des: CourseDesDBModel[];

  @HasMany(() => CourseSectionInfoDBModel, 'course_info_id')
  course_section: CourseSectionInfoDBModel[];

  @HasMany(() => CourseImageDBModel, 'course_info_id')
  course_images: CourseImageDBModel[];

  @HasMany(() => CourseVideoDBModel, 'course_info_id')
  course_videos: CourseVideoDBModel[];

  @BeforeValidate
  static validation(action: CourseInfoDBModel, options: any) {
    console.log(action)
  }
}


