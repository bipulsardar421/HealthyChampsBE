import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { RecipeCookMthdInterface, RecipeImageInterface, RecipeIngredientInterface, RecipeVideoInterface } from "../../interface";
import { RecipeCookMthdDBModel } from "./recipe-cookMthd.db.model";
import { RecipeInfoDBModel } from "./recipe-info-db.model";
import { RecipeIngredientDBModel } from "./recipe-ingredient-db.model";
import { ConfigManager } from "../../config";

@Table({
   tableName: 'recipe_video',
   timestamps: true
})

export class RecipeVideoDBModel extends Model implements RecipeVideoInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    recipe_video_id: number;
   
    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() =>RecipeInfoDBModel)
    @Column
    recipe_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    // video: string;
    set video(video) {
        this.setDataValue('video',video)
    }
    get video(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-video/recipe/'+this.getDataValue("video") 
    }
    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 

    // @AfterCreate
    // static getSubmittedData(instance: RecipeCookMthdInterface) {
    //   return instance;
    // }
    // @BeforeValidate
    // static validation(action: RecipeCookMthdDBModel, options: any) {
    //   console.log(action)
    // }
}