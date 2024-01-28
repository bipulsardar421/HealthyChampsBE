import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MeasurementDBModel } from "./measurement-db.model";
import { CountryDBModel } from "./country.db.model";
import { MeasurementCountryInterface } from "../interface";


@Table({
    tableName: 'measurement_country',
    timestamps: false
})
export class MeasurementCountryDBModel extends Model implements MeasurementCountryInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    measurement_country_id: number;

    @Column
    @ForeignKey(() => MeasurementDBModel)
    measurement_id: number;

    @Column
    @ForeignKey(() => CountryDBModel)
    country_id: number;

    @BelongsTo(() => CountryDBModel, 'country_id')
    country_details: CountryDBModel[]
}