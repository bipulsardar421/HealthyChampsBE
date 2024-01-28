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
import { NotificationInterface } from "src/interface";

@Table({
    tableName: "notification_info",
    timestamps: true,
})
export class NotificationInfoDbModel extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    notification_id: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    oneSignal_notif_id: string;
}