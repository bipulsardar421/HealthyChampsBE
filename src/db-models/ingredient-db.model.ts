import { Hash } from "crypto";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  NotEmpty,
  PrimaryKey,
  Sequelize,
  Table,
  Unique,
  Validate,
  ValidationFailed,
} from "sequelize-typescript";
import { decrypted, encrypted, sequelize } from "../helper";
import { IngredientInterface } from "../interface";
import { FoodCategoryDBModel } from "./food-category-db.model";
import { IngredientCategoryDBModel } from "./ingredient-category-db.model";
import { SupplierDBModel } from "./supplier-db.model";
import { FormDBModel } from "./form-db.model";
import { MeasurementDBModel } from "./measurement-db.model";
import { tr } from "date-fns/locale";
import { Op } from "sequelize";


@Table({
  tableName: "ingredients",
  timestamps: true,
})
export class IngredientDBModel extends Model implements IngredientInterface {
   
  @PrimaryKey
  @AutoIncrement
  @Column
  set sno(value: string) {
    let val = '';
    if (value) {
      val = decrypted(this.getDataValue(value));
    } else {
      // val = decrypted(this.getDataValue(value));

      val = this.getDataValue(value);
    }
    this.setDataValue("sno", val);
  }
  get sno(): any {
    let en = '';
    if (this.getDataValue("sno")) {
      en = encrypted(this.getDataValue("sno"));
    } else {
      en = this.getDataValue("sno")
    }
    return en;
  }

  @AllowNull(false)
  @NotEmpty
  @ForeignKey(() => SupplierDBModel)
  @Column
  supplier_name: number;

  @BelongsTo(() => SupplierDBModel, 'supplier_name')
  supplier: SupplierDBModel


  @AllowNull(false)
  @NotEmpty
  @ForeignKey(() => IngredientCategoryDBModel)
  @Column
  category: number;

  @BelongsTo(() => IngredientCategoryDBModel, 'category')
  ingredient_category: IngredientCategoryDBModel;

  @AllowNull(true)
  @Column(
    {
      unique: true,
      validate: {
         isUnique: function(value, next) {
          IngredientDBModel.findOne({
           where: Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('name')),
            Sequelize.fn('lower', value)
           )
          })
          .then((data) => {
            if(data) {
             return next('Ingredient Brand name is already present.')

            } else {
              return next();
            }
          }).catch(error => next())
         }
    }
  }
  )
  name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  quantity: string;

  @AllowNull(true)
  @NotEmpty
  @ForeignKey(() => MeasurementDBModel)
  @Column
  measurement_id: number;

  @BelongsTo(() => MeasurementDBModel, 'measurement_id')
  measurement_name: MeasurementDBModel;

  @AllowNull(false)
  @NotEmpty
  @Column
  unit_size: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  unit_price: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  priority: number;

  @AllowNull(false)
  @NotEmpty
  @ForeignKey(() => FormDBModel)
  @Column
  form_id: number;

  @BelongsTo(() => FormDBModel, 'form_id')
  form: FormDBModel;

  @AllowNull(false)
  @NotEmpty
  @Column
  cost_per_unit: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  remark: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  conversion: number;

  @AllowNull(false)
  @NotEmpty
  @ForeignKey(() => FoodCategoryDBModel)
  @Column
  food_category_id: number;

  @BelongsTo(() => FoodCategoryDBModel, 'food_category_id')
  food_category: FoodCategoryDBModel;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

}