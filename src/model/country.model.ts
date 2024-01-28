import { decrypted } from "../helper";
import { CountryInterface } from "../interface";

export class CountryModel {
    country_id: number | string;
    country_name: string;
    country_code: number | string;
    constructor(country: CountryInterface) {
        this.country_id = country.country_id
        this.country_name = country.country_name || '';
        this.country_code = country.country_code || '';
    }
}