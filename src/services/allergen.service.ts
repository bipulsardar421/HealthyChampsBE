
import { PostgresqlHelper } from "../helper";
import {AllergenDBModel} from "../db-models/allergen-db.model";
import { AllergenInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";

interface RequestAllergen {
    allergen: string
}

export class AllergenService {

    constructor() {}

    public async getAllergenList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<AllergenInterface>> {
        const searchColumn = {'allergen':'allergen',
    };
        const sortColunm={'allergen':'allergen',
        }
        const postresSqlHelper = new PostgresqlHelper();
        return await AllergenDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, AllergenDBModel,sortColunm))
        .then((allergenList) => {
             return new CollectionResultModel<AllergenInterface>(allergenList, requestBody);
             
        });
    }

    public async addAllergen(requestBody: RequestAllergen): Promise<any> {
        return await AllergenDBModel.create({
            allergen: requestBody.allergen
        });
    }

    public async deleteAllergen(requestBody: any): Promise<any> {
        return await AllergenDBModel.update({
            status: 'inactive'
        },{
            where: {allergen_id: requestBody}
        });
    }
    public async updateAllergen(requestBody: any): Promise<any> {
        return await AllergenDBModel.update({
            allergen: requestBody.allergen,
            
            status: 'active'
        },{
           where: {allergen_id: requestBody.allergen_id}
        });
    }

    public async getAllAllergen(): Promise<AllergenInterface[]> {
        return await AllergenDBModel.findAll({
            attributes: ['allergen_id', 'allergen'],
            where: {
                status: 'active'
            }
        })
    }

    public async getAllAllergens(): Promise<any> {
        return await AllergenDBModel.findAll({
            attributes: ['allergen_id', 'allergen'],
            where:{
                status:'active'
            }
        });
    }
}

