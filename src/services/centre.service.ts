import { decrypted, PostgresqlHelper } from "../helper";
import { CentreDBModel } from "../db-models/centre-db.model";
import { CentreInterface, RequestBodyInterface, RequestCentreInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { CountryDBModel } from "../db-models";
 
interface RequestCentre {
    centre_ID: string;
    country: number;
    centre_name: string;
    centre_location: string;
}
 
export class CentreService {
    
    constructor() {}
 
    public async getCentreList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<CentreInterface>> {
        const searchColumn = {'centre_id':'centre_id',
        'country':'country_name',
        'centre_name':'centre_name',
        'centre_location':'centre_location'
     };
        const sortColunm={'centre_id':'centre_id',
                       'country':'country_name',
                       'centre_name':'centre_name',
                       'centre_location':'centre_location'
                    }
        const postresSqlHelper = new PostgresqlHelper();
        const getQueryData = postresSqlHelper.tableListQuery(
            searchColumn,requestBody,CentreDBModel,sortColunm)
        getQueryData.include =[
            {
                model: CountryDBModel
            },
        ]
        return await CentreDBModel.findAndCountAll(getQueryData)
        .then((data) => {
             return new CollectionResultModel(data, requestBody);
        })
        .catch((err) =>{
            return err;
        });
    }
 
    public async addCentre(requestBody: RequestCentreInterface): Promise<any> {
        return await CentreDBModel.create({
            centre_ID: requestBody.centre_ID,
            country: requestBody.country,
            centre_name: requestBody.centre_name,
            centre_location: requestBody.centre_location
        });
    }
 
    public async deleteCentre(requestBody: any): Promise<any> {
        return await CentreDBModel.update({
            status: 'inactive'
        },{
            where: {centre_id: requestBody}
        });
    }
    public async editCentre(id): Promise<any> {
        return await CentreDBModel.findOne({
          where: {
           centre_id: decrypted(id),
          },
        });
      }

    public async updateCentre(requestBody: any): Promise<any> {
        const centre_id = requestBody.centre_id;
        return await CentreDBModel.findOne({
            where: { centre_id: centre_id }
          }).then(centreList => {
            centreList.centre_ID = requestBody.centre_ID,
            centreList.country = requestBody.country,
            centreList.centre_name = requestBody.centre_name,
            centreList.centre_location = requestBody.centre_location,
            centreList.status = 'active';
            centreList.save();
            return 'Centre Updated successfully.'
        }).catch(error => {
          return 'Centre Updated failed.!'
        });
    }

    public async getAllCentre(): Promise<CentreInterface[]> {
        return await CentreDBModel.findAll({
            attributes: ['centre_id', 'centre_ID','centre_name'],
            where: {
                status: 'active'
            }
        })
    }
    public async getAllCentres(): Promise<any> {
        return await CentreDBModel.findAll({
            include : [{
                model: CountryDBModel
            },
        ],
                where:{
                    status:'active'
                }
            });
        }
}


