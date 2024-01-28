import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate } from "sequelize-typescript";
import { ConfigManager } from "../../config";
import { decrypted, encrypted } from "../../helper";
import { MyProfileDBModel } from "./myprofile-db.model";
import { MyProfileImageInterface, MyProfileInterface } from "../../interface";
@Table({
    tableName: 'my_profile_image',
    timestamps: true
 })

 export class MyProfileImageDBModel extends Model implements MyProfileImageInterface{
 
  @PrimaryKey
  @AutoIncrement
  @Column
    set profile_image_id(value: string) {
        if (value) {
          const decryptedValue = parseInt(decrypted(value));
          this.setDataValue("profile_image_id", decryptedValue);
    } else {
          this.setDataValue("profile_image_id", null);
    }
  }

  get profile_image_id(): any {
    const storedValue = this.getDataValue("profile_image_id");
    if (storedValue === null) {
      return null;
    } else {
      return encrypted(storedValue.toString());
    }
  }
   

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>MyProfileDBModel)
    @Column
    my_profile_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    set profile_image(image) {
        this.setDataValue('profile_image',image)
    }
    get profile_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/user_profile/'+this.getDataValue("profile_image") 
    }
    
    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 
 }
 