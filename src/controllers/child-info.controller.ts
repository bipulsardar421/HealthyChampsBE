import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { ChildEditModel, CollectionResultModel } from "../model";
import { ChildInfoService } from "../services";
import * as createCsvWriter from "csv-writer";
import AppLogger from "../helper/app-logger";
import { RequestBodyInterface } from "src/interface/request-body.interface";


export class ChildInfoController implements AppRoute {
  route = "/child_Info";
  router: Router = Router();
  childinfoService: ChildInfoService = null;
  // self = this;

  constructor() {
    this.childinfoService = new ChildInfoService();
    this.router.post("/getChildInfo", this.getChildInfo);
    this.router.post("/addChildInfo", this.addChildInfo);
    this.router.put('/deleteChildInfo', this.deleteChildInfo);
    this.router.get('/editChildInfo/:id', this.editChildInfo);
    this.router.put('/updateChildInfo', this.updateChildInfo);
    this.router.get("/downloadCSVChildInfo/", this.downloadCSVChildInfo);
    this.router.post("/deleteChildMobile/:id", this.deleteChildInfoMobile.bind(this));
    this.router.get("/getChildInfoParent/:id", this.getChildInfoMobile.bind(this));
    this.router.get("/getAllChildInfo", this.getAllChildInfo);

  }


  public async getChildInfoMobile(req: any, res: any): Promise<any> {
    try {
      await this.childinfoService.getforChildInfo(decrypted(req.params.id))
        .then((data) => {
          Api.ok(req, res, data)
        }).catch((err) => {
          Api.badRequest(req, res, { message: 'child getting failed.' })
        })
    } catch (error) {
      Api.badRequest(req, res, { message: 'child getting failed.' })
    }

  }


  public async deleteChildInfoMobile(req: any, res: any): Promise<any> {
    try {
      await this.childinfoService.deleteForChildInfo(req.params.id)
        .then((data) => {
          Api.ok(req, res, { message: 'Child deleted successfully.' })
        }).catch((err) => {
          Api.badRequest(req, res, { message: 'Child not deleted.' })
        })
    } catch (error) {
      Api.badRequest(req, res, { message: 'Child not deleted.' })
    }

  }

  public async getChildInfo(req: any, res: any): Promise<any> {
    try {
      const _childinfoService = new ChildInfoService();
      const parentID = (req.body.filterFields.parent_id);
      const getChildInfoList = await _childinfoService.getChildInfo({
        ...req.body,
        filterFields: { parent_id: parentID },
      })
        .then((data) => {
          return res.jsonp(data);
        })
    } catch (err) {
      res.status(500).jsonp({ error: 'An error occurred while fetching child information.' });
    }
  }

  public async addChildInfo(req: any, res: any): Promise<any> {
    const decAbc = decrypted(req.body.parent_id)
    const childInfo = {
      ...req.body, parent_id: decAbc
    }
    try {
      const _childinfoService = new ChildInfoService();
      await _childinfoService.addChildInfo(childInfo)
        .then(async (data) => {
          Api.ok(req, res, {
            message: "ChildInfo added successfully"
          })
        })
    } catch (error) {
      AppLogger.error('child add', error)
      if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message
        })
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'Error'
        })
      }
    }
  }

  public async editChildInfo(req, res): Promise<any> {
    const _childinfoService = new ChildInfoService();
    const getRecipeInfoList = await _childinfoService
      .editChildInfo(req.params.id)
      .then((data) => {
        return Api.ok(req, res, data.map(list => ChildEditModel.create(list.dataValues)));
      });
  }

  public async updateChildInfo(req, res): Promise<any> {
    try {
      const childinfoServices = new ChildInfoService();
      await childinfoServices
        .updateChildInfo(req.body)
        .then((childinfoList) => {
          Api.ok(req, res, {
            message: "ChildInfo updated successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedChild", error);
      Api.invalid(req, res, {
        message: "ChildInfo updated Failed.",
      });
    }
  }
  public async deleteChildInfo(req, res): Promise<any> {
    try {
      const childinfoServices = new ChildInfoService();
      await childinfoServices
        .deleteChildInfo(req.body)
        .then((childinfoList) => {
          Api.ok(req, res, {
            message: "ChildInfo deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedChildInfo", error);
      Api.invalid(req, res, {
        message: "ChildInfo deleted Falied.",
      });
    }
  }

  public async downloadCSVChildInfo(req: any, res: any): Promise<any> {
    try {
      const _childinfoService = new ChildInfoService();
      const _helper = new PostgresqlHelper();
      await _childinfoService
        .getAllChildInfo()
        .then((data) => {
          const fields = [
            {
              label: "child_info_id",
              value: (row, field) => decrypted(row[field.label]),
            },
            {
              label: "Child Name",
              value: "child_name",
            },
            {
              label: "Date Of Birth",
              value: "date_of_birth",
            },
            // {
            //   label: "Allergen",
            //   value: (row) => {
            //     const allergenValues = row.allergen.map((d) => d.allergen_details.allergen);
            //     return allergenValues.join(", ");
            //   },
            // },

            // {
            //   label: "Dietary",
            //   value: (row) => {
            //     const dietaryValues = row.dietary.map((d) => d.dietery_details.dietary);
            //     return dietaryValues.join(", ");
            //   },
            // },
            // {
            //   label: "Nutrition Category",
            //   value: (row) => {
            //     const nutriCatValues = row.nutrition_category.map((d) => d.nutrition_details.nutrition_category);
            //     return nutriCatValues.join(", ");
            //   },
            // },
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
        })
    }
    catch (e) {
      res.status(400).send({
        success: false,
        code: 400,
        error: {
          description: e?.errors?.customsCode?.message || e.message,
        },
      });
    }
  }

  public async getAllChildInfo(req, res): Promise<any> {
    try {
      const _childinfoService = new ChildInfoService();
      await _childinfoService.getAllChildInfo().then((childName) => {
        Api.ok(req, res, { childName: childName });
      })
    }
    catch (err) {
      Api.invalid(req, res, { message: "ChildInfo add Failed." });
      AppLogger.error("addChildInfo", err);
    }
  }

  // public async getAllChildInfo(req, res): Promise<any> {
  //   try {
  //     const _childinfoService = new ChildInfoService();
  //     await _childinfoService.getAllChildInfo().then((childName) => {
  //       Api.ok(req, res, { childName: childName });
  //     })
  //   }
  //   catch (err) {
  //     Api.invalid(req, res, { message: "ChildInfo add Failed." });
  //     AppLogger.error("addChildInfo", err);
  //   }
  // }
  // 


}
