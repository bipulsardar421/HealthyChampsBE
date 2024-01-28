import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Model, NotEmpty, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { SupplierDBModel } from "./supplier-db.model";
import { IngredientCategoryDBModel } from "./ingredient-category-db.model";
import { IngredientDBModel } from "./ingredient-db.model";
import { MeasurementDBModel } from "./measurement-db.model";
import { FormDBModel } from "./form-db.model";
import { FoodCategoryDBModel } from "./food-category-db.model";

@Table({
  tableName: "ingredients",
  timestamps: true,
})
export class IngredientUploadCSVDBModel extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  sno: number;

  @AllowNull(false)
  @ForeignKey(() => SupplierDBModel)
  @Column
  supplier_name: number;

  @BelongsTo(() => SupplierDBModel, 'supplier_name')
  supplier: SupplierDBModel

  set SupplierName(value: number) {
    this.setDataValue("supplier_name", value);
    SupplierDBModel.findByPk(value).then((supplier) => {
      if (supplier) {
        this.setDataValue("supplier_id", supplier.supplier_id);
      } else {
        this.setDataValue("supplier_id", null);
      }
    });
  }

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
        isUnique: function (value, next) {
          IngredientDBModel.findOne({
            where: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('name')),
              Sequelize.fn('lower', value)
            )
          })
            .then((data) => {
              if (data) {
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
