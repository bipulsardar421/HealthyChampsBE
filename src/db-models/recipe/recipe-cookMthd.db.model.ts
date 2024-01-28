import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Sequelize, BelongsTo } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { RecipeCookMthdInterface, RecipeIngredientInterface } from "../../interface";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { RecipeIngredientDBModel } from "./recipe-ingredient-db.model";


@Table({
   tableName: 'recipe_cooking_method',
   timestamps: true
})
export class RecipeCookMthdDBModel extends Model implements RecipeCookMthdInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    cooking_method_id: number;
    // set cooking_method_id(value: string) {
    //   let val = '';
    //   if(value) {
    //      val = decrypted(this.getDataValue(value));
    //   } else {
    //     val = this.getDataValue(value);
    //   }
   
    //   this.setDataValue("cooking_method_id", val);
    // }
    // get cooking_method_id(): any {
    //   let en = '';
    //   if(this.getDataValue("cooking_method_id")) {
    //     en = encrypted(this.getDataValue("cooking_method_id"));
    //   } else {
    //     en = this.getDataValue("cooking_method_id")
    //   }
    //    return en;
    // } 
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>RecipeInfoDBModel)
    @Column
    recipe_info_id: number;
   
    @AllowNull(false)
    @NotEmpty
    @Column
    cooking_method: string;

    @AllowNull(false)
    @Default('active')
    @Column
    status: string; 

  }