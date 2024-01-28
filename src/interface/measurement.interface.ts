import { MeasurementCountryInterface } from "./measurement-country.interface";

export type MeasurementInterface  = {
    measurement_id: number,
    measurement_name: string,
    country_name?: MeasurementCountryInterface[];
}

export interface RequestMeasurementInterface {
    measurement_name: string,
    country_name: number[];
};