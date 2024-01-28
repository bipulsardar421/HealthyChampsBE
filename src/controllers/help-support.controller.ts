import { Router } from "express";
import { AppRoute } from "../app-route";
import AppLogger from "..//helper/app-logger";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { HelpandSupportService } from "../services/help-support.service";
import { FAQModel } from "../model/Faq.model";
// import { FaqEditModel } from "../model/faq";




export class helpandsupportController implements AppRoute {
  route = "/help_and_support";
  router: Router = Router();


  constructor() {
    this.router.post("/getHelpandSupport", this.getHelpandSupport);
    this.router.post("/addHelpandSupport", this.addHelpandSupport);
    this.router.get("/editHelpandSupport/:id", this.editHelpandSupport);
    this.router.put("/updateHelpandSupport", this.updateHelpandSupport);
    this.router.put("/deleteHelpandSupport", this.deleteHelpandSupport);
    this.router.get("/downloadCSVHelpandSupport", this.downloadHelpandSupport);
    
    this.router.post("/getFAQ", this.getFAQ);
    this.router.post("/addFAQ", this.addFAQ);
    this.router.get("/editFAQ/:id", this.editFAQ);
    this.router.post("/updateFAQ", this.updateFAQ);
    this.router.put("/deleteFAQ", this.deleteFAQ);

  }
  
  public async getHelpandSupport(req: any, res: any): Promise<any> {
    const _helpandsupportService = new HelpandSupportService();
      await _helpandsupportService
      .gethelpandsupport(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async getFAQ(req: any, res: any): Promise<any> {
    const _helpandsupportService = new HelpandSupportService();
    await _helpandsupportService
      .getFAQ(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }




  public async addHelpandSupport(req: any, res: any):  Promise<any> {
    try{
    const _helpandsupportService = new HelpandSupportService();
    await _helpandsupportService.addhelpandsupport(req.body)
    .then((helpId) => {
        Api.ok(req, res, {
        message: 'Success',
        help:helpId['dataValues']
      })
    })
  }catch(error) {
        AppLogger.error('Help and Support add', error)
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


public async addFAQ(req: any, res: any):  Promise<any> {
  try{
  const _helpandsupportService = new HelpandSupportService();
  await _helpandsupportService.addFAQ(req.body)
  .then((faqId) => {
      Api.ok(req, res, {
      message: 'Success',
    })
  })}
  catch(error) {
      AppLogger.error('FAQ add', error)
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

public async editHelpandSupport(req: any, res: any): Promise<any> {
  const _helpandsupportService = new HelpandSupportService();
  const getHelpList = await _helpandsupportService
    .editHelpandSupport(req.params.id)
    .then((data) => { 
      return res.jsonp(data);
    });
  }

  public async editFAQ(req: any, res: any): Promise<any> {
    const _helpandsupportService = new HelpandSupportService();
    const getHelpList = await _helpandsupportService
      .editFAQ(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
    }

  public async updateHelpandSupport(req, res): Promise<any> {    
    console.log(req.body);
    
    try{
    const helpandsupportServices = new HelpandSupportService();
    await helpandsupportServices
      .updateHelpandSupport(req.body)
      .then((helpList) => {
          Api.ok(req, res, {
          message: "Help and Support updated successfully",
        });
      })}
      catch(error){
        AppLogger.error("deletedHelp", error);
        Api.invalid(req, res, {
          message: "Help updated Failed.",
        });
      }
  }

  public async updateFAQ(req, res): Promise<any> {
    try{
    const helpandsupportServices = new HelpandSupportService();
    await helpandsupportServices.updateFAQ(req.body)
      .then((faqList) => {
          Api.ok(req, res, {
          message: "FAQ updated successfully",
        });
      })}
      catch(error) {
        AppLogger.error("deletedFaq", error);
        Api.invalid(req, res, {
          message: "FAQ updated Failed.",
        });
      }
  }

  public async deleteHelpandSupport(req, res): Promise<any> {
    try{
    const _helpandsupportService = new HelpandSupportService();
    await _helpandsupportService
    .deletehelpandsupport(req.body.help_support_id)
    .then((courseinfoList) => {
      Api.ok(req, res, {
        message: "Help and Support deleted successfully.",
      });
    })}
    catch(error){
      AppLogger.error("deletedHelpandSupport", error);
      Api.invalid(req, res, {
        message: "Help and Support deleted Failed.",
      });
    }
}


public async deleteFAQ(req, res): Promise<any> {
  try{
  const _helpandsupportService = new HelpandSupportService();
  await _helpandsupportService
  .deletehelpandsupport(req.body.faq_id)
  .then((faqList) => {
    Api.ok(req, res, {
      message: "FAQ deleted successfully.",
    });
  })}
  catch(error) {
    AppLogger.error("deletedFAQ", error);
    Api.invalid(req, res, {
      message: "FAQ deleted Failed.",
    });
  }
}

public async downloadHelpandSupport(req: any, res: any): Promise<any> {
  try{
  const _helpandsupportService = new HelpandSupportService();
  const _helper = new PostgresqlHelper();
  await _helpandsupportService
    .getAllHelpandSupport()
    .then((data) => {
      const fields = [
        {
          label: "help_support_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Country Code",
          value: "country_code",
        },
        {
          label: "Phone Number",
          value: "phone_number",
        },
        {
          label: "Email Address",
          value: "email_address",
        },
       
                             
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "helpsupport.csv",
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
  }catch(e){
      res.status(400).send({
        success: false,
        code: 400,
        error: {
          description: e?.errors?.customsCode?.message || e.message,
        },
      });
    }
}
}
