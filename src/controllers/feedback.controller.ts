import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { FeedbackService } from "../services";
import * as createCsvWriter from "csv-writer";
import AppLogger from "../helper/app-logger";
import * as Sequalize from 'sequelize';
import { request } from "http";
import {  Request, Response } from "express";


export class FeedbackController implements AppRoute {
  route = "/feedback";
  router: Router = Router();
  feedbackService: FeedbackService = null;
  self = this;
  private _feedbackService:FeedbackService;
  constructor() {
    this.router.post("/getFeedback", this.getFeedback);
    this.router.post("/addFeedback", this.addFeedback);
    this.router.put('/deleteFeedback', this.deleteFeedback);
    this.router.get('/editFeedback/:id', this.editFeedback);
    this.router.put('/updateFeedback', this.updateFeedback);
    this.router.get("/downloadCSVFeedback/", this.downloadFeedback);
    this.router.post("/getallFeedback", this.getAllFeedback);
    this.router.get("/viewFeedback/:id", this.viewFeedback);
    this.router.get("/getFeedbackCount", this.getFeedbackCount);

    // this.router.post("/getVerbiage", this.getVerbiage);
    // this.router.post("/addVerbiage", this.addVerbiage);
    // this.router.put('/deleteVerbiage', this.deleteVerbiage);
    // this.router.get('/editVerbiage/:id', this.editVerbiage);
    // this.router.put('/updateVerbiage', this.updateVerbiage);
    // this.router.get("/viewVerbiage/:id", this.viewVerbiage);
    // this.router.get("/getAllVerbiage", this.getAllVerbiage);
    // this.router.get("/getVerbiagedetail/:id",this.getVerbiagedetail);
    this.feedbackService = new FeedbackService();
  }
  
  public async getFeedbackCount(req: any, res: any): Promise<void> {
    try {
      const feedbackService = new FeedbackService();
      const count = await feedbackService.getFeedbackCount();
      res.json(count);
    } catch (error) {
      console.error('Error fetching feedback count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // public async getVerbiagedetail(req:any,res:any):Promise<any>{
  //   const _feedbackService = new FeedbackService();
  //    await _feedbackService.getVerbiagedetail(req.params.id)
  //     .then((data) => {
  //       return res.jsonp(data);
  //     })
  // }
  public async getFeedback(req: any, res: any): Promise<any> {
    const _feedbackService = new FeedbackService();
    const getChildInfoList = await _feedbackService.getFeedback(req.body)
      .then((data) => {
        return res.jsonp(data);
      })
    
  }

  // public async getVerbiage(req: any, res: any): Promise<any> {
  //   const _feedbackService = new FeedbackService();
  //   const getChildInfoList = await _feedbackService.getVerbiage(req.body)
  //     .then((data) => {
  //       return res.jsonp(data);
  //     })
    
  // }

  public async addFeedback(req:any, res:any): Promise<any> {
    try {
      const _feedbackService = new FeedbackService();
       await _feedbackService.addFeedback(req.body)
        .then((data) => {
          Api.ok(req, res, {
            message: "success",
            child: data['dataValues']        
            })
        })
      }catch(error){
          AppLogger.error('Feedback add', error)
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

  // public async addVerbiage(req:any, res:any): Promise<any> {
  //   try {
  //     const _feedbackService = new FeedbackService();
  //      await _feedbackService.addVerbiage(req.body)
  //       .then((data) => {
  //         Api.ok(req, res, {
  //           message: "success",
  //           child: data['dataValues']        
  //           })
  //       })
  //     }catch(error){
  //         AppLogger.error('verbiage add', error)
  //         if(error.name === 'SequelizeValidationError') {
  //         Api.invalid(req, res,  {
  //         message: error.errors[0].message})
  //         } else {
  //           Api.badRequest(req, res, {
  //             errorCode: 500,
  //             message: 'Error'
  //           })
  //         }
  //     }  
  // }

  public async viewFeedback(req, res: any): Promise<any> {
    const _feedbackService = new FeedbackService();
    await _feedbackService.viewFeedback(req.params.id)
    .then(data => Api.ok(req, res, data))
    .catch(err => Api.badRequest(req, res, err))
  }

  // public async viewVerbiage(req, res: any): Promise<any> {
  //   const _feedbackService = new FeedbackService();
  //   await _feedbackService.viewVerbiage(req.params.id)
  //   .then(data => Api.ok(req, res, data))
  //   .catch(err => Api.badRequest(req, res, err))
  // }

  public async editFeedback(req, res): Promise<any> {
    const _feedbackService = new FeedbackService();
    const getRecipeInfoList = await _feedbackService
      .editFeedback(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
}

// public async editVerbiage(req, res): Promise<any> {
//   const _feedbackService = new FeedbackService();
//   const getRecipeInfoList = await _feedbackService
//     .editVerbiage(req.params.id)
//     .then((data) => {
//       return res.jsonp(data);
//     });
// }

  public async updateFeedback(req, res): Promise<any> {
    try{
    const _feedbackService = new FeedbackService();
    await _feedbackService
      .updateFeedback(req.body)
      .then((childinfoList) => {
        Api.ok(req, res, {
          message: "Feedback update successfully.",
        });
      })}
      catch(error) {
        AppLogger.error("deletedFeedback", error);
        Api.invalid(req, res, {
          message: "FeedBack update Failed.",
        });
      }
  }

  // public async updateVerbiage(req, res): Promise<any> {
  //   try{
  //   const _feedbackService = new FeedbackService();
  //   await _feedbackService
  //     .updateVerbiage(req.body)
  //     .then((childinfoList) => {
  //       Api.ok(req, res, {
  //         message: "Verbiage update successfully.",
  //       });
  //     })}
  //     catch(error) {
  //       AppLogger.error("deletedFeedback", error);
  //       Api.invalid(req, res, {
  //         message: "Verbiage update Failed.",
  //       });
  //     }
  // }

  public async deleteFeedback(req, res): Promise<any> {
    try{
    const _feedbackService = new FeedbackService();
    await _feedbackService
      .deleteFeedback(req.body.feedback_id)
      .then((childinfoList) => {
        Api.ok(req, res, {
          message: "Feedback deleted successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedFeedback", error);
        Api.invalid(req, res, {
          message: "Feedback deleted Failed.",
        });
      }
  }

  // public async deleteVerbiage(req, res): Promise<any> {
  //   try{
  //   const _feedbackService = new FeedbackService();
  //   await _feedbackService
  //     .deleteVerbiage(req.body.verbiage_id)
  //     .then((childinfoList) => {
  //       Api.ok(req, res, {
  //         message: "verbiage deleted successfully."
  //       });
  //     })
  //   }catch(error){
  //       AppLogger.error("deletedverbiage", error);
  //       Api.invalid(req, res, {message: "Verbiage deleted Falied."});
  //     }
  // }

  public async downloadFeedback(req: any, res: any): Promise<any> {
    try{
    const _childinfoService = new FeedbackService();
    const _helper = new PostgresqlHelper();
    await _childinfoService
      .getAllFeedback()
      .then((data) => {
        const fields = [
          {
            label: "feedback_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Parent id",
            value: "parent.email_address",
          },
          {
            label: "Error Reported ",
            value: "error_reported",
          },
          {
            label: "Suggestions Given ",
            value: "suggestions_given",
          },
          
               
                                 
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "child.csv",
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
      })}
      catch(e){
        res.status(400).send({
          success: false,
          code: 400,
          error: {
            description: e?.errors?.customsCode?.message || e.message,
          },
        });
      }
  }

  public async getAllFeedback(req, res): Promise<any> {
    try{
    const _feedbackService = new FeedbackService();
    await _feedbackService.getAllFeedback().then((feedBackName) => {
      Api.ok(req, res, {feedBackName: feedBackName });
    })} 
    catch(err) {
      Api.invalid(req, res, { message: "Feedback add Failed." });
      AppLogger.error("addFeedback", err);
    }
  }

  // public async getAllVerbiage(req, res): Promise<any> {
  //   try{
  //   const _feedbackService = new FeedbackService();
  //   await _feedbackService.getAllVerbiage()
  //   .then((verbiage) => {
  //     Api.ok(req, res, verbiage)
  //   })}
  //   catch(error) {
  //     AppLogger.error("verbiage Service", error);
  //     Api.invalid(req, res, {
  //       message: "verbiage getting Failed.",
  //     });
  //   }
  // } 
}
