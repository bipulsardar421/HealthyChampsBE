import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate } from "sequelize-typescript";
import { PodcastsImageInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { PodcastsInfoDBModel } from "./podcasts-info-db.model";
import { ConfigManager } from "../../config";


@Table({
   tableName: 'podcasts_image',
   timestamps: true
})
export class PodcastsImageDBModel extends Model implements PodcastsImageInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    podcasts_image_id: number;
   
    
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>PodcastsInfoDBModel)
    @Column
    podcasts_info_id: number;

   //  @AllowNull(true)
   //  @NotEmpty
   //  @Column
   //  icon_image: string;

   //  @AllowNull(true)
   //  @NotEmpty
   //  @Column
   //  thumbnail_image: string;

   //  @AllowNull(true)
   //  @NotEmpty
   //  @Column 
   //  banner_image: string;

   //  @AllowNull(true)
   //  @NotEmpty
   //  @Column
   //  podcasts_main_image: string;

    @AllowNull(true)
    @NotEmpty
    @Column
    set icon_image(image) {
        this.setDataValue('icon_image',image)
    }
    get icon_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/podcasts/'+this.getDataValue("icon_image") 
    }

    @AllowNull(true)
    @NotEmpty
    @Column
    set thumbnail_image(image) {
        this.setDataValue('thumbnail_image',image)
    }
    get thumbnail_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/podcasts/'+this.getDataValue("thumbnail_image") 
    }


    @AllowNull(true)
    @NotEmpty
    @Column
    set banner_image(image) {
        this.setDataValue('banner_image',image)
    }
    get banner_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/podcasts/'+this.getDataValue("banner_image") 
    }

    @AllowNull(true)
    @NotEmpty
    @Column
    set podcasts_main_image(image) {
        this.setDataValue('podcasts_main_image',image)
    }
    get podcasts_main_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/podcasts/'+this.getDataValue("podcasts_main_image") 
    }

    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 

    
    // @BeforeValidate
    // static validation(action: RecipeCookMthdDBModel, options: any) {
    //   console.log(action)
    // }
  }