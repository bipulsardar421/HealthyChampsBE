import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
  } from "sequelize-typescript";
  
  import { BlogRatingsInterface } from "../../interface";
  import { ParentInfoDBModel } from "../parent-info-db.model";
  import { BlogInfoDBModel } from "../blog/blog-info-db.model";
  import { decrypted, encrypted } from "../../helper"; 

  @Table({
    tableName: "blog_ratings",
    timestamps: true,
  })
  export class BlogRatingsDBModel extends Model implements BlogRatingsInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    set blog_ratings_id(value: string) {
      let val: string | number = '';
      if (value) {
        val = parseInt(decrypted(value));
      } else {
        val = parseInt(this.getDataValue(value));
      }
  
      this.setDataValue("blog_ratings_id", val);
    }
    get blog_ratings_id(): any {
      let en = '';
      if(this.getDataValue("blog_ratings_id")) {
        en = encrypted(this.getDataValue("blog_ratings_id"));
      } else {
        en = this.getDataValue("blog_ratings_id")
      }
      return en;
    }
  
    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel) 
    @Column
    parent_id: number;

    @AllowNull(false)
    @ForeignKey(() => BlogInfoDBModel)
    @Column
    blog_info_id: number;
  
    @AllowNull(true)
    @NotEmpty
    @Column(DataType.DATE)
    date_time: Date;

    @AllowNull(true)
    @NotEmpty
    @Column(DataType.DOUBLE)
    blog_rating: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    blog_review: string;
  
   
    @AllowNull(true)
    @Default("active")
    @Column
    status: string;
  
   @BelongsTo(() => BlogInfoDBModel)
    blogg: BlogInfoDBModel;
  
   @BelongsTo(() => ParentInfoDBModel)
    parent: ParentInfoDBModel;
  }