import { MeasurementCountryInterface, RequestMeasurementInterface } from "../interface";
import { MeasurementCountryModel } from "./measurement-country.model";

export class MeasurementAddModel {
    measurement_name: string = '';
    status: string = 'active';
    user_id: number = 0;
    country_name: Partial<MeasurementCountryInterface>[] = [];

    public static create(measurement?: RequestMeasurementInterface): MeasurementAddModel {
        return new MeasurementAddModel(measurement)
    }

    constructor(measurement?: RequestMeasurementInterface) {
        if (measurement) {
            this._intFormObj(measurement);
        }
    }
    protected _intFormObj(measurement?: RequestMeasurementInterface) {
        Object.assign(this, measurement);
        this.country_name = measurement.country_name.map(measurementList => MeasurementCountryModel.create(measurementList));
        
    }

}