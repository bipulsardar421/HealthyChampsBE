import { MeasurementCountryInterface, MeasurementInterface } from "src/interface";

export class MeasurementEditModel {
    measurement_name: string = '';
    status: string = 'active';
    user_id: number = 0;
    country_name: number[] = [];
    countries: Partial<MeasurementCountryInterface>[] = [];

    public static create(measure?: MeasurementInterface):MeasurementEditModel {
        return new MeasurementEditModel(measure)
    }

    constructor(measure?: MeasurementInterface) {
        if (measure) {
            this._intFormObj(measure);
        }
    }

    protected _intFormObj(measure?: MeasurementInterface) {
        console.log(measure);
        Object.assign(this, measure);
        this.countries = measure.country_name;
    }
}
