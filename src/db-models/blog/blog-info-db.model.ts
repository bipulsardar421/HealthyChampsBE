import {
  AfterCreate,
  AllowNull,
  AutoIncrement,
  BeforeValidate,
  BelongsTo,
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
import { BlogInfoInterface } from "../../interface/blog/blog-info.interface";
import { decrypted, encrypted } from "../../helper";
import { BlogcategoryDBModel } from "../blog-category-db.model";
import { BlogImageDBModel } from "./blog-image.db.model";

@Table({
  tableName: "blog_info",
  timestamps: true,
})
export class BlogInfoDBModel extends Model implements BlogInfoInterface {

  @PrimaryKey
  @AutoIncrement
  @Column
  set blog_info_id(value: string) {
    let val: string | number = '';
    if (value) {
      val = parseInt(decrypted(value));
    } else {
      val = parseInt(this.getDataValue(value));
    }

    this.setDataValue("blog_info_id", val);
  }
  get blog_info_id(): any {
    let en = '';
    if (this.getDataValue("blog_info_id")) {
      en = encrypted(this.getDataValue("blog_info_id"));
    } else {
      en = this.getDataValue("blog_info_id")
    }

    return en;
  }
  @AllowNull(false)
  @NotEmpty
  @Column
  blog_title: string;

  @AllowNull(true)
  @NotEmpty
  @ForeignKey(() => BlogcategoryDBModel)
  @Column
  blog_category: number;

  @BelongsTo(() => BlogcategoryDBModel, 'blog_category')
  blogcategory: BlogcategoryDBModel

  @AllowNull(false)
  @NotEmpty
  @Column
  published_date: Date;

  @AllowNull(false)
  @NotEmpty
  @Column
  author: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  content: string;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @HasMany(() => BlogImageDBModel, 'blog_info_id')
  blogs_images: BlogImageDBModel[]

  @AfterCreate
  static getSubmittedData(instance: BlogInfoInterface) {
    return instance;
  }

  @BeforeValidate
  static validation(action: BlogInfoDBModel, options: any) {
    console.log(action)
  }

}

