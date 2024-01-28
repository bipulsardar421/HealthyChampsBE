import {
  AfterCreate,
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeValidate,
  BelongsTo,
  BelongsToAssociation,
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
import { RecipeInfoInterface } from "../../interface";
import { decrypted, encrypted, sequelize } from "../../helper";
import { HighlyNutritionalDBModel } from "../highly-nutritional-db.model";
import { MealTypeDBModel } from "../meal-type-db.model";
import { NutritionCategoryDBModel } from "../nutrition-category-db.model";
import { RecipeDietaryDBModel } from "./recipe-dietary-db.model";
import { RecipeAllergenDBModel } from "./recipe_allergen-db.model";
import { RecipeHighlyNutriDBModel } from "./recipe-highly-nutritional-db.model";
import { RecipeAgeGroupDBModel } from "./recipe-age-group-db.model";
import { RecipeNutritionalCatDBModel } from "./recipe-nutritional-category-db.model";
import { Op } from "sequelize";
import { RecipeImageDBModel } from "./recipe-image.db.model";


@Table({
  tableName: "recipe_info",
  timestamps: true,
})
export class RecipeInfoDBModel extends Model implements RecipeInfoInterface {

  @PrimaryKey
  @AutoIncrement
  @Column
  set recipe_info_id(value: string) {
    let val: string | number = '';
    console.log('444444', value)
    if (value) {
      val = parseInt(decrypted(value));
    } else {
      val = parseInt(this.getDataValue(value));
    }

    this.setDataValue("recipe_info_id", val);
  }
  get recipe_info_id(): any {
    let en = '';
    if (this.getDataValue("recipe_info_id")) {
      en = encrypted(this.getDataValue("recipe_info_id"));
    } else {
      en = this.getDataValue("recipe_info_id")
    }

    return en;
  }
  @AllowNull(true)
  @Column(
    {
      unique: true,
      validate: {
        isUnique: function (value, next) {
          console.log(this.getDataValue('recipe_info_id'));
          RecipeInfoDBModel.findOne({
            where: {
              $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('recipe_name')),
                Sequelize.fn('lower', value)
              ),
              status: 'active',
              recipe_info_id: {[Op.ne]: this.getDataValue('recipe_info_id')}
            }
          })
            .then((data) => {
              if (data !== null) {
                return next('Recipe Name is already present.')

              } else {
                return next();
              }
            }).catch(error => next())
        }
      }
    }
  )
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
  @ForeignKey(() => MealTypeDBModel)
  @Column({
    type: DataType.INTEGER
  })
  meal_type: number;

  @BelongsTo(() => MealTypeDBModel, 'meal_type')
  mealType: MealTypeDBModel;

  @AllowNull(false)
  @NotEmpty
  @Column
  no_of_serves: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  meal_time: string;
  @AllowNull(false)
  @NotEmpty
  @Column
  mostly_liked: boolean;

  @AllowNull(false)
  @NotEmpty
  @Column
  nutrition_rich: boolean;

  @AllowNull(false)
  @NotEmpty
  @Column
  mostly_consumed: boolean;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @HasMany(() => RecipeDietaryDBModel, 'recipe_info_id')
  dietary: RecipeDietaryDBModel[]

  @HasMany(() => RecipeAllergenDBModel, 'recipe_info_id')
  allergen: RecipeAllergenDBModel[]

  @HasMany(() => RecipeHighlyNutriDBModel, 'recipe_info_id')
  highly_nutritional: RecipeHighlyNutriDBModel[]

  @HasMany(() => RecipeAgeGroupDBModel, 'recipe_info_id')
  age_group: RecipeAgeGroupDBModel[]
  
  @HasMany(() => RecipeNutritionalCatDBModel, 'recipe_info_id')
  nutrition_category: RecipeNutritionalCatDBModel[]

  @HasMany(() => RecipeImageDBModel, 'recipe_info_id')
  recipe_images: RecipeImageDBModel[]

  
  @AfterCreate
  static getSubmittedData(instance: RecipeInfoInterface) {
    return instance;
  }
 
  @BeforeValidate
  static validation(action: RecipeInfoDBModel, options: any) {
    console.log(action)
  }
}


