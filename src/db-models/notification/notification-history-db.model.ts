import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import { ParentInfoDBModel } from "../parent-info-db.model";
import { NotificationHistory, NotificationInterface } from "src/interface";
import { NotificationAccessDbModel } from "./notification-access-db.model";

@Table({
    tableName: "notification_history",
    timestamps: true,
})
export class NotificationHistoryDbModel extends Model implements NotificationHistory {
   
    @PrimaryKey
    @AutoIncrement
    @Column
    history_id: number;


    @AllowNull(true)
    @NotEmpty
    @Column
    notification_id: number;

    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    images: string;

    @AllowNull(true)
    @NotEmpty
    @Column
    title: string;

    @AllowNull(true)
    @NotEmpty
    @Column
    message: string;

    @AllowNull(true)
    @NotEmpty
    @Column
    route: string;

    @BelongsTo(() => ParentInfoDBModel)
    parentInfo: ParentInfoDBModel;



}