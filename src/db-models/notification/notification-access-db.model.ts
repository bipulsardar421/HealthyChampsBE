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
import { NotificationAccess, NotificationInterface } from "src/interface";

@Table({
    tableName: "notification_access",
    timestamps: true,
})
export class NotificationAccessDbModel extends Model implements NotificationAccess {

    @PrimaryKey
    @AutoIncrement
    @Column
    access_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    notification_enabled: boolean;

    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;

    @BelongsTo(() => ParentInfoDBModel)
    parentInfo: ParentInfoDBModel;

}