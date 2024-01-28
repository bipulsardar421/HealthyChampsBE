import {
  AfterCreate,
    AllowNull,
    AutoIncrement,
    BeforeValidate,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
  } from "sequelize-typescript";
import { WorkshopInfoInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { DateOnlyDataType, IntegerDataType } from "sequelize";
import { WorkshopCredentialsDBModel } from "./workshop-credentials-db.model";
import { WorkshopImageDBModel } from "./workshop-image-db.model";
import { WorkshopVideoDBModel } from "./workshop-video.db.model";
import { WorkshopDescriptionDBModel } from "./workshop-description-db.model";
  
  @Table({
    tableName: "workshop_info",
    timestamps: true,
  })
  export class WorkshopInfoDBModel extends Model implements WorkshopInfoInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    set workshop_info_id(value: string) {
      let val: string | number = '';
      if (value) {
        val = parseInt(decrypted(value));
      } else {
        val = parseInt(this.getDataValue(value));
      }
  
      this.setDataValue("workshop_info_id", val);
    }
    get workshop_info_id(): any {
      let en = '';
      if(this.getDataValue("workshop_info_id")) {
        en = encrypted(this.getDataValue("workshop_info_id"));
      } else {
        en = this.getDataValue("workshop_info_id")
      }
     
      return en;
    }
  
    @AllowNull(false)
    @NotEmpty
    @Column
    title: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    start_date: Date;

    @AllowNull(false)
    @NotEmpty
    @Column
    end_date: Date;

    @AllowNull(false)
    @NotEmpty
    @Column
    start_time: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    end_time: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    duration: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    organiser: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    mode: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    session_type: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    session_cost: number;
    
    @AllowNull(true)
    @NotEmpty
    @Default('active')
    @Column
    status: string;

    @HasMany(() => WorkshopCredentialsDBModel, 'workshop_info_id')
    workshop_credentials: WorkshopCredentialsDBModel[]

    @HasMany(() => WorkshopDescriptionDBModel, 'workshop_info_id')
    workshop_des: WorkshopDescriptionDBModel[]

    @HasMany(()=> WorkshopImageDBModel, 'workshop_info_id')
    workshop_images: WorkshopImageDBModel[]

    @HasMany(()=> WorkshopVideoDBModel, 'workshop_info_id')
    workshop_videos: WorkshopVideoDBModel[]

    @AfterCreate
    static getSubmittedData(instance: WorkshopInfoInterface) {
      return instance;
    }
   
    @BeforeValidate
    static validation(action: WorkshopInfoDBModel, options: any) {
      console.log(action)
    }

  }
  

