import { Router } from "express";
import * as createCsvWriter from "csv-writer";
import { AppRoute } from "../app-route";
import AppLogger from "..//helper/app-logger";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import * as multer from "multer";
import { subscriptionAppService } from "..//services/subscription-app.service";




export class SubscriptionAppController implements AppRoute {
  route = "/subscription_app";
  router: Router = Router();


  constructor() {
    this.router.post("/getSubscriptionApp", this.getSubscriptionApp);
    this.router.post("/addSubscriptionApp", this.addSubscriptionApp);
    this.router.put('/deleteSubscriptionApp', this.deleteSubscriptionApp);
    this.router.get("/downloadCSVSubApp", this.downloadCSV);
    this.router.post("/getSubscribedUser", this.getSubscribedUser);
  }
  
  public async getSubscriptionApp(req: any, res: any): Promise<any> {
    const _subscriptionappService = new subscriptionAppService();
    await _subscriptionappService
      .getSubscriptionApp(req.body)
      .then((data) => { 
        return res.jsonp(data);
      });
  }

  public async getSubscribedUser(req: any, res: any): Promise<any> {
    const _subscriptionappService = new subscriptionAppService();
    try {
      await _subscriptionappService
        .getSubscribedUser(req.body)
        .then((data) => {
          if (data.length === 0) {
            return res.status(404).json({ message: 'No subscriptions found for the given parentId' });
          }
          return res.json(data);
        });
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  public async addSubscriptionApp(req: any, res: any):  Promise<any> {
    try{
    const _subscriptionappService = new subscriptionAppService();
    await _subscriptionappService.addSubscriptionApp(req.body)
    .then((courseId) => {
        Api.ok(req, res, {
        message: 'Success',
      })
    })
  }catch(error) {
        AppLogger.error('Subscription add', error)
        if(error.name === 'SequelizeValidationError') {
        Api.invalid(req, res,  {
        message: error.errors[0].message})
        } else {
          Api.badRequest(req, res, {
            errorCode: 500,
            message: 'Error'
          })
        }
    }
}


  public async deleteSubscriptionApp(req, res): Promise<any> {
    try{
    const _subscriptionappService = new subscriptionAppService();
    await _subscriptionappService
    .deleteSubscriptionApp(req.body.subscription_app_id)
    .then((courseinfoList) => {
      Api.ok(req, res, {
        message: "Subscription deleted successfully.",
      });
    })}
    catch(error) {
      AppLogger.error("deletedsubscription", error);
      Api.invalid(req, res, {
        message: "Subscription deleted Failed.",
      });
    }
}

public async downloadCSV(req: any, res: any): Promise<any> {
  const courseinfoService = new subscriptionAppService();
  const _helper = new PostgresqlHelper();
  await courseinfoService
    .getAllSubscriptionApp()
    .then((data) => {
      const fields = [
        {
          label: "subscription_app_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "User Name",
          value: "user_name",
        },
        {
          label: "Periodicity",
          value: "periodicity",
        },
        {
          label: "From Date",
          value: "from_date",
        },
        {
          label: "To Date",
          value: "to_date",
        },
        {
          label: "Cost",
          value: "cost",
        },
        
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "SubscriptionApp.csv",
        csv: _helper.downloadResouce(fields, data),
      };

      if (
        FileDetails &&
        FileDetails.contentType === "text/csv" &&
        FileDetails.csv
      ) {
        res.setHeader(
          "content-disposition",
          `attachment; filename=${FileDetails.fileName}`
        );
        res.setHeader("Content-Type", "text/csv");
        res.attachment(FileDetails.fileName);
        return res.status(200).send(FileDetails.csv);
      }

      res.set("Content-Type", "application/json");
      res.type("json");
      const body = {
        success: true,
        code: 200,
        data: FileDetails,
      };
      res.status(200).send(body);
    })
    .catch((e) => {
      res.status(400).send({
        success: false,
        code: 400,
        error: {
          description: e?.errors?.customsCode?.message || e.message,
        },
      });
    });
}
 
}