import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate } from "sequelize-typescript";
import { decrypted, encrypted } from "../../helper";
import { BlogInfoDBModel } from "./blog-info-db.model";
import { BlogImageInterface } from "../../interface/blog/blog-image.interface";
import { ConfigManager } from "../../config";
@Table({
   tableName: 'blog_image',
   timestamps: true
})
export class BlogImageDBModel extends Model implements BlogImageInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    blog_image_id: number;
    
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>BlogInfoDBModel)
    @Column
    blog_info_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    set icon_image(image) {
      this.setDataValue('icon_image',image)
  }
    get icon_image(): string {
      const config = new ConfigManager().config;
      return config.baseUrl+'/api-image/blogs/'+this.getDataValue("icon_image") 
  }

    @AllowNull(true)
    @NotEmpty
    @Column
    set thumbnail_image(image) {
      this.setDataValue('thumbnail_image',image)
      }
    get thumbnail_image(): string {
      const config = new ConfigManager().config;
      return config.baseUrl+'/api-image/blogs/'+this.getDataValue("thumbnail_image") 
      }
   

    @AllowNull(true)
    @NotEmpty
    @Column
    set blog_main_image(image) {
      this.setDataValue('blog_main_image',image)
      }
    get blog_main_image(): string {
      const config = new ConfigManager().config;
      return config.baseUrl+'/api-image/blogs/'+this.getDataValue("blog_main_image") 
      }
   

    @AllowNull(true)
    @NotEmpty
    @Column
    set banner_image(image) {
      this.setDataValue('banner_image',image)
      }
    get banner_image(): string {
      const config = new ConfigManager().config;
      return config.baseUrl+'/api-image/blogs/'+this.getDataValue("banner_image") 
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