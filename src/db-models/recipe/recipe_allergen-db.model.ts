import { AutoIncrement, BeforeUpdate, BelongsTo, Column, ForeignKey, HasAssociation, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RecipeAllergenInterface } from "../../interface";
import { AllergenDBModel } from "../allergen-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";


@Table({
    tableName: 'recipe_allergen',
    timestamps: false
})
export class RecipeAllergenDBModel extends Model implements RecipeAllergenInterface{

    @PrimaryKey
    @AutoIncrement
    @Column
    recipe_allergen_id: number;

    @Column
    @ForeignKey(() => RecipeInfoDBModel)
    recipe_info_id: number;

    @Column
    @ForeignKey(() => AllergenDBModel)
    allergen_id: number;
   
    @BelongsTo(() => AllergenDBModel, 'allergen_id')
    allergen_details: AllergenDBModel[];
}