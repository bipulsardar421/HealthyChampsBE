import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
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
import { decrypted, encrypted, sequelize } from "../../helper";
import { UserRolesDBModel } from "../user-role-db.model";
import { CountryDBModel } from "../country.db.model";
import { CentreDBModel } from "../centre-db.model";
import { RoleUserDBModel } from "../role-user-db.model";
import { MyProfileInterface } from "../../interface";
import { MyProfileImageDBModel } from "./myprofile-image-db.model";
import { UserSignUpDBModel } from "../user_signup-db.model";
import { ConfigManager } from "../../config";
@Table({
    tableName: "my_profile",
    timestamps: true,
})

export class MyProfileDBModel extends Model implements MyProfileInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    set my_profile_id(value: string) {
        let val: string | number = '';
        if (value) {
            val = decrypted(this.getDataValue(value));
        } else {
            val = this.getDataValue(value);
        }
        this.setDataValue("my_profile_id", val);
    }
    get my_profile_id(): any {
        let en = '';
        if (this.getDataValue("my_profile_id")) {
            en = encrypted(this.getDataValue("my_profile_id"));
        } else {
            en = this.getDataValue("my_profile_id")
        }
        return en;
    }

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => UserSignUpDBModel)
    @Column({
        type: DataType.BIGINT
    })
    user_signup_id: number;

    @BelongsTo(() => UserSignUpDBModel, 'user_signup_id')
    roleusers: UserSignUpDBModel[]


    // @AllowNull(true)
    // @NotEmpty
    // @ForeignKey(() => UserRolesDBModel)
    // @Column({
    //     type: DataType.BIGINT
    // })
    // role_id: number;

    // @BelongsTo(() => UserRolesDBModel, 'role_id')
    // userroles: UserRolesDBModel[]

    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => CentreDBModel)
    @Column({
        type: DataType.BIGINT
    })
    center: number;

    @BelongsTo(() => CentreDBModel, 'center')
    centres: CentreDBModel[]

    // @AllowNull(true)
    // @NotEmpty
    // @ForeignKey(() => CountryDBModel)
    // @Column({
    //     type: DataType.BIGINT
    // })
    // country: number;

    // @BelongsTo(() => CountryDBModel, 'country')
    // countries: CountryDBModel[]

    // @AllowNull(false)
    // @NotEmpty
    // @Column
    // mobile_number: string;

    // @AllowNull(false)
    // @NotEmpty
    // @Column
    // email_address: string;

    @AllowNull
    @NotEmpty
    @Column
    set profile_image(image: string) {
        this.setDataValue('profile_image', image)
    }
    get profile_image(): string {
        const config = new ConfigManager().config;
        return config.baseUrl + '/api-image/user_profile/' + this.getDataValue("profile_image")
    }


    @AllowNull(true)
    @NotEmpty
    @Default('active')
    @Column
    status: string;

    // @HasMany(() => MyProfileImageDBModel, 'my_profile_id')
    // profile_image: MyProfileImageDBModel

}
