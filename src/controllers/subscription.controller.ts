import { Router } from "express";
import { SubscriptionService } from "../services";
import * as createCsvWriter from "csv-writer";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";
import { Api, decrypted, PostgresqlHelper } from "../helper";




export class SubscriptionController implements AppRoute {
  route = "/subscription";
  router: Router = Router();
  constructor() {
    this.router.post("/getSubscription", this.getSubscription);
    this.router.post("/addSubscription", this.addSubscription);
    this.router.get("/editSubscription/:id", this.editSubscription);
    this.router.put("/deleteSubscription", this.deleteSubscription);
    this.router.put("/updateSubscription",this.updateSubscription);
    this.router.get('/allSubscription',this.getAllSubscription);
    this.router.get("/downloadCSVSubscription", this.downloadCSV);
  }

  public async getSubscription(req: any, res: any): Promise<any> {
    try{
    const _workshopinfoService = new SubscriptionService();
    const getSubscriptionList = await _workshopinfoService
      .getSubscription(req.body)
       return res.jsonp(getSubscriptionList);
      }catch(error){
        AppLogger.error('getRoleUser', error)
        Api.invalid(req,res, {message: 'RoleUser List Failed'})
        }
      }
  


  public async addSubscription(req: any, res: any):  Promise<any> {
    try{
    const workshopinfoServices = new SubscriptionService();
    await workshopinfoServices.addSubscription(req.body)
    .then((subscriptionList) => {
        Api.ok(req, res, {
        message: 'Subscription add successfully.',
        
      })
    })
  }catch(error){
        AppLogger.error('workshop add', error)
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


  public async editSubscription(req: any, res: any): Promise<any> {
    const _workshopService = new SubscriptionService();
    const getSubscriptionList = await _workshopService
      .editSubscription(req.params.subscription_id)
      .then((data) => {
        return res.jsonp(data);
      }); 
  }

  public async deleteSubscription(req, res): Promise<any> {
    try{
    const subscriptionServices = new SubscriptionService();
    await subscriptionServices.deleteSubscription(req.body.id)
    .then((subscriptionList) => {
        Api.ok(req, res, {message: 'Subscription deleted successfully.'})
    })
  }catch(error){
        AppLogger.error('deletedSubscription', error)
        Api.invalid(req, res,  {message: 'Subscription deleted Falied.'})
    }
}

public async updateSubscription(req, res): Promise<any> {
  try{
  const subscriptionServices = new SubscriptionService();
  await subscriptionServices
    .updateSubscription(req.body)
    .then((subscriptionList) => {
      Api.ok(req, res, {
        message: "Subscription update successfully.",
      });
    })
  }catch(error) {
      AppLogger.error("deletedSubscription", error);
      Api.invalid(req, res, {
        message: "Subscription update Falied.",
      });
    }
}

public async getAllSubscription(req, res): Promise<any>{
try{
    const subscriptionServices = new SubscriptionService();
    await subscriptionServices.getSubscriptionAll().then((allsubscription) => {
        Api.ok(req, res, allsubscription)
    })}
    catch(error){
        AppLogger.error('getAllSubscription', error)
    }

}public async downloadCSV(req: any, res: any): Promise<any> {
  const courseinfoService = new SubscriptionService();
  const _helper = new PostgresqlHelper();
  await courseinfoService
    .getAllSubscription()
    .then((data) => {
      const fields = [
        {
          label: "subscription_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Periodicity",
          value: "periodicity",
        },
        {
          label: "Cost",
          value: "cost",
        },
        
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "Subscription.csv",
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