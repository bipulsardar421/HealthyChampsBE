import {
    AllowNull,
    AutoIncrement,
    Column,
    ForeignKey,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import { NotificationInfoDbModel, ParentInfoDBModel } from "../index";

@Table({
    tableName: "notification_mark_as_read",
    timestamps: true,
})
export class NotificationMarDbModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    mar_id: number;

    @AllowNull(false)
    @ForeignKey(() => NotificationInfoDbModel)
    @Column
    notification_id: string;

    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: string;

}