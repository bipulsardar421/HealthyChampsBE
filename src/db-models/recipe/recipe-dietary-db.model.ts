import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RecipeDietaryInterface } from "../../interface";
import { DietaryDBModel } from "../dietary-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";


@Table({
    tableName: 'recipe_dietary',
    timestamps: false
})
export class RecipeDietaryDBModel extends Model implements RecipeDietaryInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    recipe_dietary_id: number;

    @Column
    @ForeignKey(() => RecipeInfoDBModel)
    recipe_info_id: number;

    @Column
    @ForeignKey(() => DietaryDBModel)
    dietary_id: number;

    @BelongsTo(() => DietaryDBModel, 'dietary_id')
    dietary_details: DietaryDBModel[]

    @BelongsTo(() => RecipeInfoDBModel, 'recipe_info_id')
    recipe_info: RecipeInfoDBModel;
}