import { AutoIncrement, Column, PrimaryKey, Table, Model, HasMany, AllowNull, ForeignKey, NotEmpty, BelongsTo, Default, HasOne } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { RecipeIngredientInterface } from "../../interface";
import { IngredientCategoryDBModel } from "../ingredient-category-db.model";
import { IngredientDBModel } from "../ingredient-db.model";
import { RecipeAltIngredientDBModel } from "./recipe-altIng-db.model";
import { RecipeEditDBModel } from "./recipe-edit-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { MeasurementDBModel } from "../measurement-db.model";
import { FormDBModel } from "../form-db.model";


@Table({
   tableName: 'recipe_ingredient',
   timestamps: true
})
export class RecipeIngredientListDBModel extends Model implements RecipeIngredientInterface {
   @PrimaryKey
   @AllowNull(true)
   @AutoIncrement
   @Column
   recipe_ing_id: number;

   @AllowNull(true)
   @NotEmpty
   @ForeignKey(() => RecipeEditDBModel)
   @Column
   recipe_info_id: number;

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

   @AllowNull(true)
   @NotEmpty
   @ForeignKey(() => IngredientDBModel)
   @Column
   ing_brandname_id: number;

   @BelongsTo(() => IngredientDBModel, 'ing_brandname_id')
   names: IngredientDBModel;

   @AllowNull(true)
   @NotEmpty
   @ForeignKey(() => MeasurementDBModel)
   @Column
   measurement_id: number;

   @BelongsTo(() => MeasurementDBModel, 'measurement_id')
   measurement_name: MeasurementDBModel;

   @AllowNull(false)
   @NotEmpty
   @ForeignKey(() => FormDBModel)
   @Column
   form_id: number;

   @BelongsTo(() => FormDBModel, 'form_id')
   form: FormDBModel;

   @AllowNull(true)
   @Default('active')
   @Column
   status: string;

   @HasMany(() => RecipeAltIngredientDBModel, 'recipe_ing_id')
   alternateIngredient: RecipeAltIngredientDBModel[];

  
}