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
import { decrypted, encrypted, sequelize } from "../helper";
import { NutritionInterface } from "../interface";
import { IngredientDBModel } from "./ingredient-db.model";

@Table({
  tableName: "nutritional_value",
  timestamps: true,
})
export class NutritionDBModel extends Model implements NutritionInterface {

  @PrimaryKey
  @AutoIncrement
  @Column
  set nutrition_id(value: string) {
    let val = '';
    if(value) {
       val = decrypted(this.getDataValue(value));
    } else {
      val = this.getDataValue(value);
    }
    this.setDataValue("nutrition_id", val);
  }
  get nutrition_id(): any {
    let en = '';
    if(this.getDataValue("nutrition_id")) {
      en = encrypted(this.getDataValue("nutrition_id"));
    } else {
      en = this.getDataValue("nutrition_id")
    }
    return en;
  }

  @AllowNull(false)
  @ForeignKey(() => IngredientDBModel)
  @Column
  ingredient_name: number; 

  @BelongsTo(() => IngredientDBModel, 'ingredient_name')
  ingredients : IngredientDBModel; 

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  weight: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  energy: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  protein: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  total_fat: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  saturated_fat: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  trans_fat: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.DOUBLE)
  polysat_fat: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  monosat_fat: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  carb: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  sugar: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  added_sugar: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  free_sugar: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  dietery_fibre: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  thiamin: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  riboflarin: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  niacin: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  vitamin_c: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  vitamin_e: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  vitamin_b6: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  vitamin_b12: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  total_folate: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  total_vitamin_a: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  sodium: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  potassium: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  magnessium: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  calcium: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  phosphorus: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  iron: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  zinc: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  selenium: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  iodine: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  omega3: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.DOUBLE)
  protien_foods: number;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;
}


