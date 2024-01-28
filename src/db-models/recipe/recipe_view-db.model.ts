import {
  AfterCreate,
  AfterFind,
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

import { RecipeAltIngredientDBModel } from "./recipe-altIng-db.model";
import { RecipeCookMthdDBModel } from "./recipe-cookMthd.db.model";
import { RecipeImageDBModel } from "./recipe-image.db.model";
import { RecipeTipsDBModel } from "./recipe-tips-db.model";
import { RecipeVideoDBModel } from "./recipe-video.db.model";
import { RecipeEditInterface } from "../../interface/recipe/recipe-edit.interface";
import { RecipeIngredientListDBModel } from "./recipe_ing_list-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { AgeGroupDBModel } from "../age-group-db.model";

@Table({
  tableName: "recipe_info",
  timestamps: true,
})
export class RecipeViewDBModel extends Model {
  //   RecipeInfo
  @PrimaryKey
  @AllowNull(true)
  @NotEmpty
  @Column
  recipe_info_id: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  recipe_name: string;


  @AllowNull(false)
  @NotEmpty
  @Column
  preparation_time: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  cooking_time: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  calories: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  difficulty_level: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  meal_type: number;


  @AllowNull(false)
  @NotEmpty
  @Column
  no_of_serves: number;


  @AllowNull(false)
  @NotEmpty
  @Column
  meal_time: string;

  // RecipeIngre
  // @HasMany(() => RecipeIngredientListDBModel, 'recipe_info_id')
  // recipe_ingredient: RecipeIngredientListDBModel[];


  // Cookingmthd

  // @HasMany(() => RecipeCookMthdDBModel, 'recipe_info_id')
  // cook_method: RecipeCookMthdDBModel;


  // CookingTips

  // @HasMany(() => RecipeTipsDBModel, 'recipe_info_id')
  // recipe_tip: RecipeTipsDBModel;

  // RecipeImage

  // @HasMany(() => RecipeImageDBModel, 'recipe_info_id')
  // recipe_images: RecipeImageDBModel;

  // RecipeVideo

  // @HasMany(() => RecipeVideoDBModel, 'recipe_info_id')
  // recipe_videos: RecipeVideoDBModel;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @AfterFind
  static async findDon(result, option, fn) {
    console.log('ddddddd', option, fn)
    return await result

  }
}


