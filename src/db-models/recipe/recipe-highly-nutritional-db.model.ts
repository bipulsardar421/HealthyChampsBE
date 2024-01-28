import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RecipeHighlyNutriInterface } from "../../interface";
import { AllergenDBModel } from "../allergen-db.model";
import { HighlyNutritionalDBModel } from "../highly-nutritional-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";

@Table({
    tableName: 'recipe_highly_nutritional',
    timestamps: false
})
export class RecipeHighlyNutriDBModel extends Model implements RecipeHighlyNutriInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    recipe_highly_nutritional_id: number;

    @Column
    @ForeignKey(() => RecipeInfoDBModel)
    recipe_info_id: number;
    
    @Column
    @ForeignKey(() => HighlyNutritionalDBModel)
    highly_nutritional_id: number;

    @BelongsTo(() => HighlyNutritionalDBModel, 'highly_nutritional_id')
    highly_details: HighlyNutritionalDBModel[];
}