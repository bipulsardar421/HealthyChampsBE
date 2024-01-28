export class MeasurementCountryModel {
    country_id : number = 0;
    
    public static create(country_name?: number): MeasurementCountryModel {
        return new MeasurementCountryModel(country_name);
    }

    constructor(country_name?: number){
        if(country_name) {
            this._initFormObj(country_name)
        }
    }

    protected _initFormObj(country_name: number) {
        this.country_id = country_name;
    }
}
export class MeasurementCountryEditModel {
    country_id: number = 0;
    measurement_id: number = 0;

    public static create(countryName?: number, measurement_id?: number): MeasurementCountryEditModel {
     return new MeasurementCountryEditModel(countryName, measurement_id);
    }

    constructor(countryName?: number, measurement_id?: number) {
     if(countryName && measurement_id) {
        this._initFormObj(countryName, measurement_id)
     }
    }

    protected _initFormObj(countryName: number, measurement_id: number) {
        this.country_id = countryName;
        this.measurement_id = measurement_id;
    }
}