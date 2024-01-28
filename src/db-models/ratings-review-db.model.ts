  // import {
  //   AllowNull,
  //   AutoIncrement,
  //   BelongsTo,
  //   Column,
  //   DataType,
  //   Default,
  //   ForeignKey,
  //   Model,
  //   NotEmpty,
  //   PrimaryKey,
  //   Table,
  // } from "sequelize-typescript";

  // import { RecipeInfoDBModel } from "./recipe/recipe-info-db.model";
  // import { RatingsReviewInterface } from "../interface";
  // import { ParentInfoDBModel } from "./parent-info-db.model";
  // import { WorkshopInfoDBModel } from "./workshop/workshop-info-db.model";
  // import { BlogInfoDBModel } from "./blog/blog-info-db.model";

  // @Table({
  //   tableName: "ratings_reviews",
  //   timestamps: true,
  // })
  // export class RatingsReviewDBModel extends Model implements RatingsReviewInterface {
  //   @PrimaryKey
  //   @AutoIncrement
  //   @Column
  //   ratings_reviews_id: number;

  //   @AllowNull(false)
  //   @ForeignKey(() => ParentInfoDBModel) 
  //   @Column
  //   parent_id: number;

  //   @AllowNull(false)
  //   @NotEmpty
  //   @Column(DataType.DATE)
  //   date_time: Date;

  //   @AllowNull(false)
  //   @NotEmpty
  //   @Column
  //   type: string;

  //   @AllowNull(false)
  //   @NotEmpty
  //   @Column
  //   review: string;

  //   @AllowNull(false)
  //   @ForeignKey(() => RecipeInfoDBModel)
  //   @Column
  //   recipe_info_id: number;

  //   @AllowNull(false)
  //   @ForeignKey(() => WorkshopInfoDBModel)
  //   @Column
  //   workshop_info_id: number;

  //   @AllowNull(false)
  //   @ForeignKey(() => BlogInfoDBModel)
  //   @Column
  //   blog_info_id: number;

  //   @AllowNull(true)
  //   @NotEmpty
  //   @Column(DataType.DOUBLE)
  //   rating: number;

  

  //   @BelongsTo(() => ParentInfoDBModel)
  //   parent: ParentInfoDBModel;

  //   @BelongsTo(() => RecipeInfoDBModel)
  //   recipe: RecipeInfoDBModel;

  //   @BelongsTo(() => WorkshopInfoDBModel)
  //   workshop: WorkshopInfoDBModel;

  //   @BelongsTo(() => BlogInfoDBModel)
  //   blog: BlogInfoDBModel;
  // }