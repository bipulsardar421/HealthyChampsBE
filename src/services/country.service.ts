
import { PostgresqlHelper } from "../helper";
import {CountryDBModel} from "../db-models/country.db.model";
import { CountryInterface, FilterBodyInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel, CountryModel } from "../model";

interface RequestCountry {
    country_code: string,
    country_name: string,
}

export class CountryService {

    constructor() {}

    public async getCountryList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<CountryInterface>> {
        const searchColumn = {'country_code':'country_code',
        'country_name':'country_name',
     };
        const sortColunm={'country_code':'country_code',
                       'country_name':'country_name',
                    }
        const postresSqlHelper = new PostgresqlHelper();
        return await CountryDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, CountryDBModel,sortColunm))
        .then((countryList) => {
             return new CollectionResultModel<CountryInterface>(countryList, requestBody);
             
        });
    }

    public async addCountry(requestBody: RequestCountry): Promise<any> {
        return await CountryDBModel.create({
            country_code: requestBody.country_code,
            country_name: requestBody.country_name,
        });
    }

    public async deleteCountry(requestBody: any): Promise<any> {
        return await CountryDBModel.update({
            status: 'inactive'
        },{
            where: {country_id: requestBody}
        });
    }
    public async updateCountry(requestBody: any): Promise<any> {
        return await CountryDBModel.update({
            country_code: requestBody.country_code,
            country_name: requestBody.country_name,
            status: 'active'
        },{
           where: {country_id: requestBody.country_id}
        });
    }

    public async getAllCountry(): Promise<CountryInterface[]> {
        return await CountryDBModel.findAll({
            attributes: ['country_id', 'country_code','country_name'],
            where: {
                status: 'active'
            }
        })
    }
    public async getAllCountries(): Promise<any> {
        return await CountryDBModel.findAll({
            attributes: ['country_id', 'country_code', 'country_name'],
            where:{
                status:'active'
            }
        });
    }

}

