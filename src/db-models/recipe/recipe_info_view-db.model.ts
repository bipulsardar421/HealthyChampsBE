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
    Table
} from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { RecipeInfoInterface } from ".././../interface";
import { AgeGroupDBModel } from "../age-group-db.model";
import { AllergenDBModel } from "../allergen-db.model";
import { DietaryDBModel } from "../dietary-db.model";
import { HighlyNutritionalDBModel } from "../highly-nutritional-db.model";
import { MealTypeDBModel } from "../meal-type-db.model";
import { NutritionCategoryDBModel } from "../nutrition-category-db.model";
import { RecipeAgeGroupDBModel } from "./recipe-age-group-db.model";
import { RecipeDietaryDBModel } from "./recipe-dietary-db.model";
import { RecipeHighlyNutriDBModel } from "./recipe-highly-nutritional-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { RecipeNutritionalCatDBModel } from "./recipe-nutritional-category-db.model";
import { RecipeAllergenDBModel } from "./recipe_allergen-db.model";


@Table({
    tableName: "recipe_info",
    timestamps: true,
  })
export class RecipeInfoViewModel extends Model implements RecipeInfoInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    set recipe_info_id(value: string) {
      let val = '';
      if (value) {
        val = decrypted(this.getDataValue(value));
      } else {
        val = this.getDataValue(value);
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
            RecipeInfoDBModel.findOne({
              where: {
                $and: Sequelize.where(
                  Sequelize.fn('lower', Sequelize.col('recipe_name')),
                  Sequelize.fn('lower', value)
                ),
                status: 'active'
              }
            })
              .then((data) => {
                if (data) {
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
  
    @HasMany(() => MealTypeDBModel, 'meal_type_id')
    mealtypes: MealTypeDBModel[]
  
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

    
    
    @AfterCreate
    static getSubmittedData(instance: RecipeInfoInterface) {
      return instance;
    }
    @BeforeValidate
    static validation(action: RecipeInfoDBModel, options: any) {
      console.log(action)
    }
  }
