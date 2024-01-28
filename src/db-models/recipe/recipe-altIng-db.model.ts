import { AutoIncrement, Column, PrimaryKey, Table, Model, HasMany, AllowNull, ForeignKey, NotEmpty, BelongsTo, Default } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { RecipeAltIngredientInterface } from "../../interface";
import { IngredientCategoryDBModel } from "../ingredient-category-db.model";
import { IngredientDBModel } from "../ingredient-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { RecipeIngredientDBModel } from "./recipe-ingredient-db.model";
import { RecipeIngredientListDBModel } from "./recipe_ing_list-db.model";
import { MeasurementDBModel } from "../measurement-db.model";
import { FormDBModel } from "../form-db.model";


@Table({
   tableName: 'recipe_alt_ingredient',
   timestamps: true
})
export class RecipeAltIngredientDBModel extends Model implements RecipeAltIngredientInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    alt_ing_id: number;
   
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>RecipeIngredientListDBModel)
    @Column
    recipe_ing_id: number;
   
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => IngredientCategoryDBModel)
    @Column
    ing_category_id: number;

    @BelongsTo(() => IngredientCategoryDBModel, 'ing_category_id')
    ingredient_category: IngredientCategoryDBModel;
 
   
    @AllowNull(true)
    @NotEmpty
    @Column
    quantity: number;

    @ForeignKey(() => IngredientDBModel)
    @Column
    ing_brandname_id: number;

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => MeasurementDBModel)
    @Column
    measurement_id: number;

    @BelongsTo(() => MeasurementDBModel, 'measurement_id')
   measurement_name: MeasurementDBModel;

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => FormDBModel)
    @Column
    form_id: number;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;

   
  }
