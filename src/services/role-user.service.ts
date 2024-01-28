import { FilterBodyInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { RoleUserDBModel } from "../db-models/role-user-db.model";
import { decrypted, PostgresqlHelper, sequelize } from "../helper";
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";

export class RoleUserService {
  value: string;
  self = this;
  constructor() {
    // this.self = this;
  }

  public async getRoleUser(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn ={'first_name':'first_name',
    'last_name':'last_name',
    'email_address':'email_address',
    'mobile_number':'mobile_number', 
    'country':'country_name'
    };
    const sortColunm={'first_name':'first_name',
    'last_name':'last_name',
    'email_address':'email_address',
    'mobile_number':'mobile_number', 
    'country':'country_name'
    }
    const postresSqlHelper = new PostgresqlHelper();
    return await RoleUserDBModel.findAndCountAll(
      postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        RoleUserDBModel,
        sortColunm
      )
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async editRoleUser(id): Promise<any> {
    return await RoleUserDBModel.findOne({
      where: {
        role_user_id: decrypted(id),
      },
    });
  }

  public async getAllRoleUser(): Promise<any> {
    return await RoleUserDBModel.findAll();
  }

  
  public async getFilterRoleUser(resquestBody: FilterBodyInterface): Promise<any> {
    if(resquestBody && resquestBody.role_user_id) {
      resquestBody.role_user_id = decrypted( resquestBody.role_user_id)
    }
    return await RoleUserDBModel.findAll({
      where: resquestBody
    });
  }
}