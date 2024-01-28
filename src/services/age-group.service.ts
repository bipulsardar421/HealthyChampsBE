import { PostgresqlHelper } from "../helper";
import { AgeGroupDBModel } from "../db-models/age-group-db.model";
import { AgeGroupInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";
 
interface RequestAgeGroup {
    age_group: string;
}
 
export class AgeGroupService {
   
    constructor() {}
 
    public async getAgeGroupList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<AgeGroupInterface>> {
        const searchColumn ={'age_group':'age_group'
    };
        const sortColunm={'age_group':'age_group'
            }
        const postresSqlHelper = new PostgresqlHelper();
        return await AgeGroupDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, AgeGroupDBModel,sortColunm))
        .then((ageGroupList) => {
             return new CollectionResultModel<AgeGroupInterface>(ageGroupList, requestBody);
             
        });
    }
 
    public async addAgeGroup(requestBody: RequestAgeGroup): Promise<any> {
           const existingAgeGroup =  await AgeGroupDBModel.findOne({
            where:{
            age_group: requestBody.age_group,
            status:'inactive'
            }
        });
        if (existingAgeGroup) {
            return await AgeGroupDBModel.update(
              { status: 'active' },
              { where: { age_group_id: existingAgeGroup.age_group_id } }
            );
          } else {
              return await AgeGroupDBModel.create({
              age_group: requestBody.age_group,
              status: 'active'
            });
          }
    }

    public async deleteAgeGroup(requestBody: any): Promise<any> {
        return await AgeGroupDBModel.update({
            status: 'inactive'
        },{
            where: {age_group_id: requestBody}
        });
        
    }
    
    public async updateAgeGroup(requestBody: any): Promise<any> {
        return await AgeGroupDBModel.update({
            age_group: requestBody.age_group, 
            status: 'active'
        },{
           where: {age_group_id: requestBody.age_group_id}
        });
    }

    public async getAllAgeGroup(): Promise<AgeGroupInterface[]> {
        return await AgeGroupDBModel.findAll({
            attributes: ['age_group_id', 'age_group'],
            where: {
                status: 'active'
            }
        });
    }

    public async getAllAgeGroups(): Promise<any> {
        return await AgeGroupDBModel.findAll({
            attributes: ['age_group_id', 'age_group'],
            where: {
                status: 'active'
            }
         });
    }
 }
