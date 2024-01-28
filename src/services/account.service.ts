import { FilterBodyInterface, RequestBodyInterface,RequestAccountInterface} from "../interface";
import { CollectionResultModel } from "../model";
import { AccountDBModel } from "../db-models/account-db.model";
import { decrypted, PostgresqlHelper, sequelize } from "../helper";
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import AppLogger from "../helper/app-logger";
export class AccountService {
  value: string;
  self = this;
  constructor() {
     }

  public async getAccount(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = [
      "organisation_name",
      "organisation_address",
      "billing_account_name",
      "billing_account_number",
      "billing_account_status",
      "billing_address",
      "billing_first_name",
      "billing_last_name",
      "billing_phone_number",
      "billing_email_address",
      "sales_first_name",
      "sales_last_name",
      "sales_phone_number",
      "sales_email_address",
    ];
    const postresSqlHelper = new PostgresqlHelper();
    return await AccountDBModel.findAndCountAll(
      postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        AccountDBModel
      )
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async addAccount(
    requestBody: RequestAccountInterface
  ): Promise<any> {
    return await AccountDBModel.create({
      organisation_address: requestBody.organisation_address,
      billing_account_name: requestBody. billing_account_name,
      billing_account_number: requestBody.billing_account_number,
      billing_account_status: requestBody.billing_account_status,
      billing_address: requestBody.billing_address,
      billing_first_name: requestBody.billing_first_name,
      billing_last_name: requestBody.billing_last_name,
      billing_phone_number: requestBody.billing_phone_number,
      billing_email_address: requestBody.billing_email_address,
      sales_first_name: requestBody.sales_first_name,
      sales_last_name: requestBody.sales_last_name,
      sales_phone_number: requestBody.sales_phone_number,
      sales_email_address:requestBody.sales_email_address,
    }).catch(error => AppLogger.error('ddddddd', error));
  }


  public async editAccount(id): Promise<any> {
    return await AccountDBModel.findOne({
      where: {
        account_id: decrypted(id),
      },
    });
  }

  public async getAllAccount(): Promise<any> {
    return await AccountDBModel.findAll();
  }

  
  public async getFilterAccount(resquestBody: FilterBodyInterface): Promise<any> {
    if(resquestBody && resquestBody.account_id) {
      resquestBody.account_id = decrypted( resquestBody.account_id)
    }
    return await AccountDBModel.findAll({
      where: resquestBody
    });
  }
}