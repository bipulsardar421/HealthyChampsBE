
import { decrypted, PostgresqlHelper } from "../helper";
import { TermsandconditionsDBModel } from "../db-models/termsandconditions-dbmodel";
import { TermsandconditionsInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";

interface RequestTermsandconditions {
    termsandconditions_name: string,
    applicable_for:string,
    content:string
}

export class TermsandconditionsService {

    constructor() {}
    
    public async getTermsAndConditions(): Promise<TermsandconditionsDBModel[]> {
      try {
        const termsAndConditionsList = await TermsandconditionsDBModel.findAll();
        return termsAndConditionsList;
      } catch (error) {
        console.error('Error retrieving terms and conditions:', error);
        throw error;
      }
    }

    public async getTermsandconditionsList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<TermsandconditionsInterface>> {
        const searchColumn = {
          'termsandconditions_name':'termsandconditions_name',
          'applicable_for':'applicable_for'
    };
        const sortColunm={'termsandconditions_name':'termsandconditions_name',
    'applicable_for':'applicable_for',
    }
        const postresSqlHelper = new PostgresqlHelper();
        return await TermsandconditionsDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, TermsandconditionsDBModel,sortColunm))
        .then((termsandconditionsList) => {
             return new CollectionResultModel<TermsandconditionsInterface>(termsandconditionsList, requestBody);
             
        });
    }

    public async addTermsandconditions(requestBody: RequestTermsandconditions): Promise<any> {
        return await TermsandconditionsDBModel.create({
            termsandconditions_name: requestBody.termsandconditions_name,
            applicable_for:requestBody.applicable_for,
            content:requestBody.content
        });
    }
    public async editTermsandconditions(id): Promise<any> {
        return await TermsandconditionsDBModel.findOne({
            where: {
            termsandconditions_id:decrypted(id), 
          },
        });
      }
      public async deleteTermsandconditions(requestBody: any): Promise<any> {
        const snoAry = requestBody.map(ids => parseInt(decrypted(ids)))
        return await TermsandconditionsDBModel.findAll({
          where: { termsandconditions_id: snoAry }
        }).then((Termsandconditions) => {
            Termsandconditions.forEach(val => {
            val.status = 'inactive';
            val.save()
          })
          return 'Termsandconditions is deleted successfully.'
        }).catch(err => {
          return 'Termsandconditions is not Delete.!'
        });
      
      }
         
    // public async deleteTermsandconditions(requestBody: any): Promise<any> {
    //     //     return await TermsandconditionsDBModel.update({
    //         status: 'inactive'
    //     },{
    //         where: {termsandconditions_id: requestBody}
    //     });
    // }
    public async createTermsandconditions(req: any): Promise<any> {
      const termsandconditions =  await TermsandconditionsDBModel.create(req.userRoles[0])
      const addTermsandconditions_id = req.access_fun.map(
               (val: any) => {
                  val.termsandconditions_id = termsandconditions.termsandconditions_id;
                  return val;
              })
       await TermsandconditionsDBModel.bulkCreate(addTermsandconditions_id)  
       
       return termsandconditions
  }
  public async updateTermsandconditions(requestBody: any): Promise<any> {
    const termsandconditions_id = parseInt(decrypted(requestBody.termsandconditions_id));
    return await TermsandconditionsDBModel.findOne({
      where: { termsandconditions_id: termsandconditions_id }
    }).then(termsandconditionsList => {
      termsandconditionsList.termsandconditions_name = requestBody.termsandconditions_name;
      termsandconditionsList.applicable_for = requestBody.applicable_for;
      termsandconditionsList.content = requestBody.content,
      termsandconditionsList.status = 'active';
      termsandconditionsList.save();
      return 'Termsandconditions Updated successfully.'
    }).catch(error => {
      return 'Termsandconditions Updated failed.!'
    });
}
 
    public async getTermsandconditions(): Promise<any>{
        return await TermsandconditionsDBModel.findAll({
            where: {status: 'active'}
        });
    }
    public async  getAllTermsandconditions(): Promise<any> {
        return await TermsandconditionsDBModel.findAll({
            attributes: ['termsandconditions_id', 'termsandconditions_name','applicable_for','content'],
            where: {status: 'active'}
         });
    }
}

