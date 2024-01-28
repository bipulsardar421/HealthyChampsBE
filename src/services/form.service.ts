
import { PostgresqlHelper } from "../helper";
import { FormDBModel} from "../db-models/form-db.model";
import { FormInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";

interface RequestForm {
    form: string
}

export class FormService {

    constructor() {}

    public async getFormList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<FormInterface>> {
        const searchColumn = {'form':'form',
        };
        const sortColunm={'form':'form',
        }
        const postresSqlHelper = new PostgresqlHelper();
        return await FormDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, FormDBModel,sortColunm))
        .then((formList) => {
             return new CollectionResultModel<FormInterface>(formList, requestBody);
             
        });
    }

    public async addForm(requestBody: RequestForm): Promise<any> {
        return await FormDBModel.create({
            form: requestBody.form
        });
    }

    public async deleteForm(requestBody: any): Promise<any> {
        return await FormDBModel.update({
            status: 'inactive'
        },{
            where: {form_id: requestBody}
        });
    }
    public async updateForm(requestBody: any): Promise<any> {
        return await FormDBModel.update({
            form: requestBody.form,
            status: 'active'
        },{
           where: {form_id: requestBody.form_id}
        });
    }

    public async getAllForm(): Promise<FormInterface[]> {
        return await FormDBModel.findAll({
            attributes: ['form_id', 'form'],
            where: {
                status: 'active'
            }
        });
    }
    public async getAllForms(): Promise<any> {
        return await FormDBModel.findAll({
            attributes: ['form_id', 'form'],
            where:{
                status:'active'
            }
        });
    }
}
