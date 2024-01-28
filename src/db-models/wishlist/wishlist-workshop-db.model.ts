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

import { ParentInfoDBModel } from "../parent-info-db.model";
import { WorkshopInfoDBModel } from "../workshop/workshop-info-db.model";
import { WishlistWorkshopInterface } from "../../interface";


@Table({
    tableName: "wishlist_workshop",
    timestamps: true,
})
export class WishlistWorkshopDBModel extends Model implements WishlistWorkshopInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    wishlist_workshop_id: number;

    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;

    @AllowNull(false)
    @ForeignKey(() => WorkshopInfoDBModel)
    @Column
    workshop_info_id: number;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;


    @BelongsTo(() => WorkshopInfoDBModel)
    workshopInfo: WorkshopInfoDBModel;
}