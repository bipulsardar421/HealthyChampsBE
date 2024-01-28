
import { PostgresqlHelper } from "../helper";
import { SupplierDBModel } from "../db-models/supplier-db.model";
import { SupplierInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";

interface RequestSupplier {
    supplier: string
}

export class SupplierService {

    constructor() {}

    public async getSupplierList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<SupplierInterface>> {
        const searchColumn = {'supplier':'supplier',
            };
        const sortColunm={'supplier':'supplier',
            }
        const postresSqlHelper = new PostgresqlHelper();
        return await SupplierDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, SupplierDBModel,sortColunm))
        .then((supplierList) => {
             return new CollectionResultModel<SupplierInterface>(supplierList, requestBody);
             
        });
    }

    public async addSupplier(requestBody: RequestSupplier): Promise<any> {
        return await SupplierDBModel.create({
            supplier: requestBody.supplier
        });
    }


    public async deleteSupplier(requestBody: string[]): Promise<any> {
        return await SupplierDBModel.update({
            status: 'inactive'
        },{
            where: {supplier_id: requestBody}
        });
    }

    public async updateSupplier(requestBody: any): Promise<any> {
        return await SupplierDBModel.update({
            supplier_id: requestBody.supplier_id,
            supplier: requestBody.supplier,
            status: 'active'
        },{
           where: {supplier_id: requestBody.supplier_id}
        });
    }
    public async getSupplier(): Promise<any>{
        return await SupplierDBModel.findAll({
            where: {status: 'active'}
        });
    }
    public async  getAllSupplier(): Promise<any> {
        return await SupplierDBModel.findAll({
            attributes: ['supplier_id', 'supplier'],
            where: {status: 'active'}
         });
    }
}

