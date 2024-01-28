import {
  AfterCreate,
  AllowNull,
  AutoIncrement,
  BeforeValidate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { MealPlanInterface } from "../../interface";
import { AgeGroupDBModel } from "../age-group-db.model";
import { DietaryDBModel } from "../dietary-db.model";
import { MealPlanDateDBModel } from "./mealdate-db.model";
import { MealAgeGroupDBModel } from "./mealplan-age-group-db.model";
import { MealPlanBfDBModel } from "./mealplan-bf-db.model";
import { MealDietaryDBModel } from "./mealplan-dietary-db.model";
import { MealPlanDinnerDBModel } from "./mealplan-dinner-db.model";
import { MealPlanEsDBModel } from "./mealplan-es-db.model";
import { MealPlanLunchDBModel } from "./mealplan-lunch-db.model";
import { ConfigManager } from "../../config";

@Table({
  tableName: "meal_plan_main",
  timestamps: true,
})
export class MealPlanDBModel extends Model implements MealPlanInterface {

  @PrimaryKey
  @AutoIncrement
  @Column
  set meal_plan_id(value: string) {
    let val = '';
    if (value) {
      val = decrypted(this.getDataValue(value));
    } else {
      val = this.getDataValue(value);
    }
    this.setDataValue("meal_plan_id", val);
  }
  get meal_plan_id(): any {
    let en = '';
    if (this.getDataValue("meal_plan_id")) {
      en = this.getDataValue("meal_plan_id");
    } else {
      en = this.getDataValue("meal_plan_id")
    }
    return en;
  }

  @AllowNull
  @NotEmpty
  @Column
  meal_plan_name: string;

  @AllowNull
  @NotEmpty
  @Column
  set logo(image: string) {
    this.setDataValue('logo', image)
  }
  get logo(): string {
    const config = new ConfigManager().config;
    return config.baseUrl + '/api-image/mealplan/' + this.getDataValue("logo")
  }

  @AllowNull
  @NotEmpty
  @Column
  description: string;

  @HasMany(() => MealPlanDateDBModel, 'meal_plan_id')
  meal_plan_date: MealPlanDateDBModel[]

  @HasMany(() => MealDietaryDBModel, 'meal_plan_id')
  dietary: MealDietaryDBModel[]

  @HasMany(() => MealAgeGroupDBModel, 'meal_plan_id')
  age_group: MealAgeGroupDBModel[]


  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  in_trend: boolean;

  @AfterCreate
  static getSubmittedData(instance: MealPlanInterface) {
    return instance;
  }

  @BeforeValidate
  static validation(action: MealPlanDBModel, options: any) {
    console.log(action)
  }
}