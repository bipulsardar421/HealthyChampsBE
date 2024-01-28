import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { RecipeCookMthdInterface, RecipeImageInterface, RecipeIngredientInterface } from "../../interface";
import { RecipeCookMthdDBModel } from "./recipe-cookMthd.db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { RecipeIngredientDBModel } from "./recipe-ingredient-db.model";
import { ConfigManager } from "../../config";


@Table({
   tableName: 'recipe_image',
   timestamps: true
})
export class RecipeImageDBModel extends Model implements RecipeImageInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    recipe_image_id: number;
   
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>RecipeInfoDBModel)
    @Column
    recipe_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    set icon_image(image) {
        this.setDataValue('icon_image',image)
    }
    get icon_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/recipe/'+this.getDataValue("icon_image") 
    }

    @AllowNull(true)
    @NotEmpty
    @Column
    set thumbnail_image(image) {
        this.setDataValue('thumbnail_image',image)
    }
    get thumbnail_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/recipe/'+this.getDataValue("thumbnail_image") 
    }


    @AllowNull(true)
    @NotEmpty
    @Column
    set banner_image(image) {
        this.setDataValue('banner_image',image)
    }
    get banner_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/recipe/'+this.getDataValue("banner_image") 
    }

    @AllowNull(true)
    @NotEmpty
    @Column
    set recipe_main_image(image) {
        this.setDataValue('recipe_main_image',image)
    }
    get recipe_main_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/recipe/'+this.getDataValue("recipe_main_image") 
    }

    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 
}
