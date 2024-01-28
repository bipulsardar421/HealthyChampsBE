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
  
  import { RecipeInfoDBModel } from "../recipe/recipe-info-db.model";
  import { RecipeRatingsInterface } from "../../interface";
  import { ParentInfoDBModel } from "../parent-info-db.model";
import { decrypted, encrypted } from "../../helper";
   
  @Table({
    tableName: "recipe_ratings",
    timestamps: true,
  })
  export class RecipeRatingsDBModel extends Model implements RecipeRatingsInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    set recipe_ratings_id(value: string) {
      let val: string | number = '';
      if (value) {
        val = parseInt(decrypted(value));
      } else {
        val = parseInt(this.getDataValue(value));
      }
  
      this.setDataValue("recipe_ratings_id", val);
    }
    get recipe_ratings_id(): any {
      let en = '';
      if(this.getDataValue("recipe_ratings_id")) {
        en = encrypted(this.getDataValue("recipe_ratings_id"));
      } else {
        en = this.getDataValue("recipe_ratings_id")
      }
      return en;
    }
  
    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel) 
    @Column
    parent_id: number;

    @AllowNull(false)
    @ForeignKey(() => RecipeInfoDBModel)
    @Column
    recipe_info_id: number;
  
    @AllowNull(true)
    @NotEmpty
    @Column(DataType.DATE)
    date_time: Date;

    @AllowNull(true)
    @NotEmpty
    @Column(DataType.DOUBLE)
    recipe_rating: number;

  
    @AllowNull(true)
    @NotEmpty
    @Column
    recipe_review: string;
  
    @AllowNull(true)
    @Default("active")
    @Column
    status: string;
  
   @BelongsTo(() => RecipeInfoDBModel)
    recipe: RecipeInfoDBModel;
  
  @BelongsTo(() => ParentInfoDBModel)
    parent: ParentInfoDBModel;
  }