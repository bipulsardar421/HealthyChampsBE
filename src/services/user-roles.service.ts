import { decrypted, PostgresqlHelper } from "../helper";
import { UserRolesDBModel, UserRolesFuncDBModel } from "../db-models";
import { RequestBodyInterface, UserRoleFuncInterface, UserRoleInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { Op, Sequelize } from "sequelize";
import { log } from "console";

export class UserRolesService {

  constructor() {

  }

  public async createUserRoles(req: any): Promise<any> {
    const userRoles = await UserRolesDBModel.create(req.userRoles[0])
    const addRoleId = req.access_fun.map(
      (val: any) => {
        val.role_id = userRoles.role_id;
        return val;
      })
    await UserRolesFuncDBModel.bulkCreate(addRoleId)
    console.log('A:', req.userRoles[0], "b:", addRoleId, "c:", userRoles.role_id, 'gggggg');
    return userRoles
  }
  public async updateUserRole(requestBody: any): Promise<any> {
    const role_id = parseInt((requestBody.role_id));
    await UserRolesFuncDBModel.destroy({
      where: {
        role_id: requestBody.role_id
      }
    });
    const addRoleId = requestBody.access_fun.map(
      (val: any) => {
        val.role_id = role_id;
        return val;
      })
    const d = await UserRolesFuncDBModel.bulkCreate(addRoleId)
    return d
  }

  public async getUserRolesList(requestBody: Partial<RequestBodyInterface>):
    Promise<CollectionResultModel<UserRoleInterface>> {
    const searchColumn = {
      'role_name': 'role_name',
    };
    const sortColunm = {
      'role_name': 'role_name',
    }
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      UserRolesDBModel,
      sortColunm)
    return await UserRolesDBModel.findAndCountAll(getQueryData)
      .then((userrolelist) => {
        return new CollectionResultModel<UserRoleInterface>(
          userrolelist,
          requestBody
        );
      });
  }
  public async editUserRole(id): Promise<any> {
    return await UserRolesDBModel.findAll({
      where: {
        role_id: id,
      },
      include: [{
        model: UserRolesFuncDBModel
      }]
    });
  }

  public async uniqueValidation(requestBody: any): Promise<any> {
    return await UserRolesDBModel.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('role_name')),
          Sequelize.fn('lower', requestBody.role_name)
        ),
        status: 'active',
        role_id: { [Op.ne]: requestBody.role_id }
      }
    })
  }



  public async deleteUserRole(requestBody: any): Promise<any> {
    const role_id = requestBody.map(ids => parseInt((ids)))
    return await UserRolesDBModel.findAll({
      where: { role_id: role_id }
    }).then((userrole) => {
      userrole.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'User role is deleted successfully.'
    }).catch(err => {
      return 'User role is not Deleted.!'
    });

  }

  public async getAllUserRoles(): Promise<UserRoleInterface[]> {
    return await UserRolesDBModel.findAll({
      attributes: ['role_id', 'role_name'],
      where: {
        status: 'active'
      }
    })
  }

  public async getAccess(requestBody: any): Promise<any> {
    return await UserRolesFuncDBModel.findAll({
      where: { role_id: requestBody }
    })

  }
}