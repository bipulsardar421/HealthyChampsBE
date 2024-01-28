import { AutoIncrement, Column, PrimaryKey, Table,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Model } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { WorkshopInfoDBModel } from "./workshop-info-db.model";
import { WorkshopImageInterface } from "../../interface/workshop/workshop-image.interface";
import { ConfigManager } from "../../config";



@Table({
   tableName: 'workshop_image',
   timestamps: true
})
export class WorkshopImageDBModel extends Model implements WorkshopImageInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    workshop_image_id: number;
    
    @AllowNull(true)
    @NotEmpty
    @Column
    @ForeignKey(() =>WorkshopInfoDBModel)
    workshop_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    set icon_image(image) {
      this.setDataValue('icon_image',image)
  }
  get icon_image(): string {
      const config = new ConfigManager().config;
      return config.baseUrl+'/api-image/workshop/'+this.getDataValue("icon_image") 
  }

    @AllowNull(true)
    @NotEmpty
    @Column
    set thumbnail_image(image) {
      this.setDataValue('thumbnail_image',image)
   }
   get thumbnail_image(): string {
      const config = new ConfigManager().config;
      return config.baseUrl+'/api-image/workshop/'+this.getDataValue("thumbnail_image") 
   }
    @AllowNull(true)
    @NotEmpty
    @Column
    set banner_image(image) {
      this.setDataValue('banner_image',image)
   }
   get banner_image(): string {
      const config = new ConfigManager().config;
      return config.baseUrl+'/api-image/workshop/'+this.getDataValue("banner_image") 
   };

    @AllowNull(true)
    @NotEmpty
    @Column
    set workshop_main_image(image) {
      this.setDataValue('workshop_main_image',image)
   }
  get workshop_main_image(): string {
      const config = new ConfigManager().config;
      return config.baseUrl+'/api-image/workshop/'+this.getDataValue("workshop_main_image") 
   }
    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 

  }