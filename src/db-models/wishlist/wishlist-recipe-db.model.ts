import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

import { RecipeInfoDBModel } from "../recipe/recipe-info-db.model";
import { ParentInfoDBModel } from "../parent-info-db.model";

import { WishlistRecipeInterface } from "../../interface";

@Table({
    tableName: "wishlist_recipe",
    timestamps: true,
})
export class WishlistRecipeDBModel extends Model implements WishlistRecipeInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    wishlist_recipe_id: number;

    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;

    @AllowNull(false)
    @ForeignKey(() => RecipeInfoDBModel)
    @Column
    recipe_info_id: number;

    @AllowNull(true)
    @Default("active")
    @Column
    status: string;

    @BelongsTo(() => RecipeInfoDBModel)
    recipeInfo: RecipeInfoDBModel;
}