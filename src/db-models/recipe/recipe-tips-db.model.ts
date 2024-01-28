import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Sequelize, BelongsTo } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { RecipeTipsInterface, RecipeCookMthdInterface } from "../../interface";
import { RecipeCookMthdDBModel } from "./recipe-cookMthd.db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { RecipeIngredientDBModel } from "./recipe-ingredient-db.model";


@Table({
   tableName: 'recipe_tips',
   timestamps: true
})
export class RecipeTipsDBModel extends Model implements RecipeTipsInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    tips_id: number;
    // set tips_id(value: string) {
    //   let val = '';
    //   if(value) {
    //      val = decrypted(this.getDataValue(value));
    //   } else {
    //     val = this.getDataValue(value);
    //   }
   
    //   this.setDataValue("tips_id", val);
    // }
    // get tips_id(): any {
    //   let en = '';
    //   if(this.getDataValue("tips_id")) {
    //     en = encrypted(this.getDataValue("tips_id"));
    //   } else {
    //     en = this.getDataValue("tips_id")
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
    recipe_tips: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 

}
