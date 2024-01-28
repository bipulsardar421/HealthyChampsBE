import {
    AfterCreate,
    AllowNull,
    AutoIncrement,
    BeforeValidate,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    NotEmpty,
    PrimaryKey,
    Sequelize,
    Table,
  } from "sequelize-typescript";
import { WorkshopEditInterface } from "../../interface/workshop/workshop-edit.interface";
import { WorkshopCredentialsDBModel } from "./workshop-credentials-db.model";
import { WorkshopImageDBModel } from "./workshop-image-db.model";
import { WorkshopVideoDBModel } from "./workshop-video.db.model";
import { WorkshopDescriptionDBModel } from "./workshop-description-db.model";
  
  @Table({
    tableName: "workshop_info",
    timestamps: false,
  })
  
  export class WorkshopEditDBModel extends Model implements WorkshopEditInterface {
    //   Workshop Info
    @PrimaryKey
    @AllowNull(true)
    @NotEmpty
    @Column
    workshop_info_id: number;
  
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
  
  
    // Credentials
  
    @HasMany(() => WorkshopCredentialsDBModel, 'workshop_info_id')
    credentials: WorkshopCredentialsDBModel[];

    // Description
    @HasMany(() => WorkshopDescriptionDBModel, 'workshop_info_id')
    workshop_des: WorkshopDescriptionDBModel;
  
    // WorkshopImage
  
    @HasMany(() => WorkshopImageDBModel, 'workshop_info_id')
    workshop_images: WorkshopImageDBModel;

    // WorkshopVideo

    @HasMany(() => WorkshopVideoDBModel, 'workshop_info_id')
    workshop_videos: WorkshopVideoDBModel;
  
    @AllowNull(true)
    @Default('active')
    @Column
    status: string;
  }
  
  
  