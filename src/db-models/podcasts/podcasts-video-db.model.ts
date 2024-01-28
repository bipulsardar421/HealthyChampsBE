import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { CourseVideoInterface, PodcastsVideoInterface, RecipeCookMthdInterface, RecipeImageInterface, RecipeIngredientInterface, RecipeVideoInterface } from "../../interface";
import { PodcastsInfoDBModel } from "./podcasts-info-db.model";
import { ConfigManager } from "../../config";


@Table({
   tableName: 'podcasts_video',
   timestamps: true
})

export class PodcastsVideoDBModel extends Model implements PodcastsVideoInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    podcasts_video_id: number;
   
    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() =>PodcastsInfoDBModel)
    @Column
    podcasts_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    // video: string;
    set video(video) {
        this.setDataValue('video',video)
    }
    get video(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-video/podcasts/'+this.getDataValue("video") 
    }

    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 
}