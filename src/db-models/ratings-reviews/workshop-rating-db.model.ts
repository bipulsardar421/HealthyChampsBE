import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
  } from "sequelize-typescript";
  
  import { WorkshopRatingsInterface } from "../../interface";
  import { ParentInfoDBModel } from "../parent-info-db.model";
  import { WorkshopInfoDBModel } from "../workshop/workshop-info-db.model";
  import { decrypted, encrypted } from "../../helper"; 

  @Table({
    tableName: "workshop_ratings",
    timestamps: true,
  })
  export class WorkshopRatingsDBModel extends Model implements WorkshopRatingsInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    set workshop_ratings_id(value: string) {
      let val: string | number = '';
      if (value) {
        val = parseInt(decrypted(value));
      } else {
        val = parseInt(this.getDataValue(value));
      }
  
      this.setDataValue("workshop_ratings_id", val);
    }
    get workshop_ratings_id(): any {
      let en = '';
      if(this.getDataValue("workshop_ratings_id")) {
        en = encrypted(this.getDataValue("workshop_ratings_id"));
      } else {
        en = this.getDataValue("workshop_ratings_id")
      }
      return en;
    }
    
    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel) 
    @Column
    parent_id: number;

    @AllowNull(false)
    @ForeignKey(() => WorkshopInfoDBModel)
    @Column
    workshop_info_id: number;
  
    @AllowNull(true)
    @NotEmpty
    @Column(DataType.DATE)
    date_time: Date;
  
    @AllowNull(true)
    @NotEmpty
    @Column(DataType.DOUBLE)
    workshop_rating: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    workshop_review: string;
  
    @AllowNull(true)
    @Default("active")
    @Column
    status: string;
  
   @BelongsTo(() => WorkshopInfoDBModel)
    workshop: WorkshopInfoDBModel;
  
  @BelongsTo(() => ParentInfoDBModel)
    parent: ParentInfoDBModel;
  }