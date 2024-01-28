import { Router } from "express";
import { Api } from "../helper";
import { UserRolesService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";

export class UserRolesControll implements AppRoute {

  route = "/user_roles";
  router: Router = Router();
  constructor() {
    this.router.post('/create-user', this.createUserRoles);
    this.router.post('/get-user-list', this.gridList);
    this.router.get('/edit-user-list/:id', this.editUserRole);
    this.router.put('/update-user-list', this.updateUserRole);
    this.router.put('/delete-user-list', this.deleteUserRole);
    this.router.get('/access-user-list/:id', this.getAccess);
    this.router.get('/get-user-role-name', this.getAllUserRoles);
    this.router.post('/unique', this.uniqueValidation)

  }

  public async gridList(req: any, res: any): Promise<any> {
    try{
    const userRolesService = new UserRolesService();
    return await userRolesService.getUserRolesList(req.body)
      .then((supplierList) => {
        Api.ok(req, res, supplierList)
      })
    }catch(error){
        AppLogger.error('getUserList', error)
        Api.invalid(req, res, { message: 'User role list Failed.' })
      }
  }


  public async createUserRoles(req: any, res: any): Promise<any> {
    try{
    const userRolesService = new UserRolesService();
    return await userRolesService.createUserRoles(req.body)
      .then((addRoles) => Api.ok(req, res, {
        message: 'User role add successfully'
      }))
    }catch(err){
        Api.badRequest(req, res, { message: 'User role is not added' })
      }
  }


  public async editUserRole(req: any, res: any): Promise<any> {
    try{
    const _userRoleService = new UserRolesService();
    const getIngrentsList = await _userRoleService
      .editUserRole(req.params.id)
      .then((data) => {
        Api.ok(req, res, data);
      })}
      catch(err){
        Api.invalid(req, res, { message: "Ingredient Getting Failed." });
        AppLogger.error("addIngredientsCategory", err);
      }
  }

  public async updateUserRole(req: any, res: any): Promise<any> {
    try {
      const userRoleServices = new UserRolesService();
      const updatedUserRole = await userRoleServices.updateUserRole(req.body);
      
      return Api.ok(req, res, {
        message: 'Update Successful',
        user_role_id: updatedUserRole.role_id
      });
    } catch (error) {
      AppLogger.error("deleteduserrole", error);
      return Api.invalid(req, res, {
        message: "User role update failed.",
      });
    }
  }
  

  public async deleteUserRole(req: any, res: any): Promise<any> {
    try{
    const userRoleServices = new UserRolesService();
    await userRoleServices
      .deleteUserRole(req.body.role_id)
      .then((userRoleList) => {
        Api.ok(req, res, {
          message: "User role deleted successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deleteduserRoleList", error);
        Api.invalid(req, res, {
          message: "User role deleted Failed.",
        });
      }
  }

  public async getAllUserRoles(req, res): Promise<any> {
    try{
    const userRoleServices = new UserRolesService();
    await userRoleServices.getAllUserRoles()
    .then((userrole) => {
      Api.ok(req, res, userrole)
    })}
    catch(error) {
      AppLogger.error("userroleServices", error);
      Api.invalid(req, res, {
        message: "UserRole getting Failed.",
      });
    }
  }

  public async getAccess(req: any, res: any): Promise<any> {
    try{
    const userRoleServices = new UserRolesService();
    await userRoleServices.getAccess(req.params.id)
      .then((userRoleAccess) => {
        Api.ok(req, res, userRoleAccess);
      })
    }catch(error){
        AppLogger.error("deleteduserRoleList", error);
        Api.invalid(req, res, {
          message: "User role list Failed.",
        });
      }
  }

  public async uniqueValidation(req: any, res: any): Promise<any> {
    const userRoleServices = new UserRolesService();
    await userRoleServices
      .uniqueValidation(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }
}
   