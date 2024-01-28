import { AutoIncrement, Column, PrimaryKey, Table, Model, HasMany, AllowNull, ForeignKey, NotEmpty, BelongsTo, Default } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { RecipeIngredientInterface } from "../../interface";
import { IngredientCategoryDBModel } from "../ingredient-category-db.model";
import { IngredientDBModel } from "../ingredient-db.model";
import { RecipeAltIngredientDBModel } from "./recipe-altIng-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { MeasurementDBModel } from "../measurement-db.model";
import { FormDBModel } from "../form-db.model";


@Table({
   tableName: 'recipe_ingredient',
   timestamps: true
})
export class RecipeIngredientDBModel extends Model implements RecipeIngredientInterface {
   
    @PrimaryKey
    @AutoIncrement
    @Column
    recipe_ing_id: number;
   
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>RecipeInfoDBModel)
    @Column
    recipe_info_id: number;

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => IngredientCategoryDBModel)
    @Column
    ing_category_id: number;
   
    @AllowNull(false)
    @NotEmpty
    @Column
    quantity: number;

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => IngredientDBModel)
    @Column
    ing_brandname_id: number;

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => MeasurementDBModel)
    @Column
    measurement_id: number;

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => FormDBModel)
    @Column
    form_id: number;
   
    @AllowNull(true)
    @Default('active')
    @Column
    status: string;

    @HasMany(() => RecipeAltIngredientDBModel, 'recipe_ing_id')
    alternateIngredient: RecipeAltIngredientDBModel[];
   
  }