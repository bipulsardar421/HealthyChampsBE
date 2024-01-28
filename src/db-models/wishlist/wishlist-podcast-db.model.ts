import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";


import { ParentInfoDBModel } from "../parent-info-db.model";
import { PodcastsInfoDBModel } from "../podcasts/podcasts-info-db.model";
import { WishlistPodcastInterface } from "../../interface";

@Table({
    tableName: "wishlist_podcast",
    timestamps: true,
})
export class WishlistPodcastDBModel extends Model implements WishlistPodcastInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    wishlist_podcasts_id: number;

    @AllowNull(false)
    @ForeignKey(() => ParentInfoDBModel)
    @Column
    parent_id: number;

    @AllowNull(false)
    @ForeignKey(() => PodcastsInfoDBModel)
    @Column
    podcasts_info_id: number;

    @AllowNull(true)
    @Default("active")
    @Column
    status: string;

    @BelongsTo(() => PodcastsInfoDBModel)
    podcastsInfo: PodcastsInfoDBModel;
}