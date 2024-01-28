import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
  } from "sequelize-typescript";
 
  import { WishlistBlogInterface } from "../../interface";
  import { ParentInfoDBModel } from "../parent-info-db.model";
  import { BlogInfoDBModel } from "../blog/blog-info-db.model";
 
  @Table({
    tableName: "wishlist_blog",
    timestamps: true,
  })
  export class WishlistBlogDBModel extends Model implements WishlistBlogInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    wishlist_blog_id: number;
 
    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;
 
    @AllowNull(false)
    @ForeignKey(() => BlogInfoDBModel)
    @Column
    blog_info_id: number;
    
    @AllowNull(true)
    @Default("active")
    @Column
    status: string;
  
    
    @BelongsTo(() => BlogInfoDBModel)
    blogInfo: BlogInfoDBModel;
  }