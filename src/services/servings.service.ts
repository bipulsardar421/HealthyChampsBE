
import { PostgresqlHelper } from "../helper";
import {  RequestBodyInterface, ServingsInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { ServingsDBModel } from "../db-models/servings-db.model";

interface RequestServings {
    age_group: string
    no_of_students: number
}

export class ServingsService {

    constructor() {}

    public async getServingsList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<ServingsInterface>> {
        const searchColumn = [
            'age_group',
            'no_of_students'
        ];
        const postresSqlHelper = new PostgresqlHelper();
        return await ServingsDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, ServingsDBModel))
        .then((servingsList) => {
             return new CollectionResultModel<ServingsInterface>(servingsList, requestBody);
             
        });
    }

    public async addServings(requestBody: RequestServings): Promise<any> {
        return await ServingsDBModel.create({
          age_group: requestBody.age_group,
          no_of_students: requestBody.no_of_students
        });
    }

    public async deleteServings(requestBody: any): Promise<any> {
      return await ServingsDBModel.update({
          status: 'inactive'
      },{
          where: {servings_id: requestBody}
      });
  }

    public async getAllServings(): Promise<any> {
        return await ServingsDBModel.findAll({
            attributes: ['servings_id', 'age_group', 'no_of_students'],
            where:{
                status:'active'
            }
        });
      }

    public async updateServings(requestBody: any): Promise<any> {
       return await ServingsDBModel.update({
         age_group: requestBody.age_group,
          no_of_students: requestBody.no_of_students,
          status: 'active'
       },{
          where: {servings_id: requestBody.servings_id
           }
        });
    }


    
}
