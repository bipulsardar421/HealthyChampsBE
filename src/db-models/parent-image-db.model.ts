import { AutoIncrement, Column, PrimaryKey, Table, Model,  AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate } from "sequelize-typescript";
import { ParentInfoDBModel } from "./parent-info-db.model";
import { ConfigManager } from "../config";
import { ParentImageInterface } from "../interface/parent-image.interface";
import { decrypted, encrypted } from "../helper";

@Table({
    tableName: 'parent_image',
    timestamps: true
 })

 export class ParentProfileImageDBModel extends Model implements ParentImageInterface{
 
  @PrimaryKey
  @AutoIncrement
  @Column
    set parent_image_id(value: string) {
        if (value) {
          const decryptedValue = parseInt(decrypted(value));
          this.setDataValue("parent_image_id", decryptedValue);
    } else {
          this.setDataValue("parent_image_id", null);
    }
  }

  get parent_image_id(): any {
    const storedValue = this.getDataValue("parent_image_id");
    if (storedValue === null) {
      return null;
    } else {
      return encrypted(storedValue.toString());
    }
  }
   

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() =>ParentInfoDBModel)
    @Column
    parent_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    set profile_image(image) {
        this.setDataValue('profile_image',image)
    }
    get profile_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-image/parent/'+this.getDataValue("profile_image") 
    }
    
    @AllowNull(true)
    @Default('active')
    @Column
    status: string; 
 }
 