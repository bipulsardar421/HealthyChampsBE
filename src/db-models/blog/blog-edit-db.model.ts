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
import { BlogEditInterface } from "../../interface/blog/blog-edit.interface";
import { decrypted, encrypted } from "../../helper";
import { BlogcategoryDBModel } from "../blog-category-db.model";
import{BlogImageDBModel} from"./blog-image.db.model"    
    @Table({
      tableName: "blog_info",
      timestamps: false,
    }) 
    export class BlogEditDBModel extends Model implements BlogEditInterface {
    
    @PrimaryKey
    @AllowNull(true)
    @NotEmpty
    @Column
    blog_info_id:number;

    @AllowNull(false)
    @NotEmpty
    @Column
    blog_title: string; 
 
    @AllowNull(true)
    @NotEmpty 
    @Column
    blog_category: number;

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

    @HasMany(() => BlogImageDBModel, 'blog_info_id')
    blogs_images: BlogImageDBModel;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
    }