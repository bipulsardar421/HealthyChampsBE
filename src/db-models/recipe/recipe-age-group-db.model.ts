import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RecipeAgeGroupInterface } from "src/interface";
import { AgeGroupDBModel } from "../age-group-db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";

@Table({
    tableName: 'recipe_age_group',
    timestamps: false
})
export class RecipeAgeGroupDBModel extends Model implements RecipeAgeGroupInterface{
   
    @PrimaryKey
    @AutoIncrement
    @Column
    recipe_age_group_id: number;

    @Column
    @ForeignKey(() => RecipeInfoDBModel)
    recipe_info_id: number;

    @Column
    @ForeignKey(() => AgeGroupDBModel)
    age_group_id: number;

    @BelongsTo(() => AgeGroupDBModel, 'age_group_id')
    age_group_details: AgeGroupDBModel[];
    
}