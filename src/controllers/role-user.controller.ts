import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { RoleUserService } from "../services";
import * as createCsvWriter from "csv-writer";
import AppLogger from "../helper/app-logger";
import { RoleUserInterface } from "../interface";

export class RoleUserController implements AppRoute {
  route = "/role_user";
  router: Router = Router();
  roleUserService: RoleUserService = null;
  self = this;
  private _roleUserService: RoleUserService;
  constructor() {
    this.router.post("/getRoleUser", this.getRoleUser);
    this.router.get("/editRoleUser/:id", this.editRoleUser);
    //this.router.get("/getAllBrandName", this.getAllBrandName);
    //this.router.post("/getRoleUserBrand", this.getRoleUserWithBrandName);
    this._roleUserService = new RoleUserService();
  }

  public async getRoleUser(req: any, res: any): Promise<any> {
    try{
    const _roleUserService = new RoleUserService();
    const getRoleUserList = await _roleUserService
      .getRoleUser(req.body)
      return res.jsonp(getRoleUserList);
    }catch(error) {
      AppLogger.error('getRoleUser', error)
      Api.invalid(req,res, {message: 'RoleUser List Failed'})
      }
  }

  public async editRoleUser(req: any, res: any): Promise<any> {
    const _roleUserService = new RoleUserService();
    const getRoleUserList = await _roleUserService
      .editRoleUser(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

 }
