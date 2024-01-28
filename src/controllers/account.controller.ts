import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { AccountService } from "../services";
import * as createCsvWriter from "csv-writer";
import AppLogger from "../helper/app-logger";
import { AccountInterface } from "../interface";

export class AccountController implements AppRoute {
  route = "/account_update";
  router: Router = Router();
  accountService: AccountService = null;
  self = this;
  private _accountService: AccountService;
  constructor() {
    this.router.post("/getAccount", this.getAccount);
    this.router.get("/editAccountUpdate/:id", this.editAccount);
    this._accountService = new AccountService();
  }

  public async getAccount(req: any, res: any): Promise<any> {
    const _accountService = new AccountService();
    const getAccountList = await _accountService
      .getAccount(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async addAccount(req:any, res:any): Promise<any> {
    // try {
      const _accountService = new AccountService();
      const accountinfoList = await _accountService
        .addAccount(req.body)
        .then((data) => {
          AppLogger.error("addAccount", data);
          Api.ok(req, res, {
            message: "Account add successfully.",
          });
        })
        .catch(err => {
          console.log(err)
          Api.invalid(req, res, { message: "Account add Failed." });
          AppLogger.error("addAccount", err);
        });
      }
      
  public async editAccount(req: any, res: any): Promise<any> {
    const _accountService = new AccountService();
    const getAccountList = await _accountService
      .editAccount(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

 }
