import { Router } from "express";
import { Api, ConvertCsvFileHelper, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { IngredientService } from "../services";
// import * as createCsvWriter from "csv-writer";
import AppLogger from "../helper/app-logger";
import { IngredientInterface } from "../interface";
import * as Sequalize from 'sequelize';

export class IngredientController extends ConvertCsvFileHelper implements AppRoute {
  route = "/ingredient"; 
  router: Router = Router();
  ingredientService: IngredientService = null;
  self = this;
  private _ingredientService: IngredientService;
  constructor() {
    super();
    this.router.post("/getIngredient", this.getIngredients);
    this.router.post("/addIngredient", this.addIngredients);
    this.router.get("/editIngredient/:id", this.editIngredients);
    this.router.put('/deleteIngredientBrand', this.deleteIngredient);
    this.router.put('/updateIngredient', this.updateIngredient);
    this.router.get("/downloadCSVIngredient/", this.downloadCSV);
    this.router.get("/getAllBrandName", this.getAllBrandName);
    this.router.post("/getIngredientBrand", this.getIngredientWithBrandName);
    this.router.post('/unique', this.uniqueValidation)
    this.router.get("/viewIngredient/:id", this.viewIngredient);
    this.router.post("/uploadCSV", this.uploadCSV.bind(this));
      // this.router.get("/downloadPDFIngredient/:id", this.downloadPDF)
    this._ingredientService = new IngredientService();
  }

  public async getIngredients(req: any, res: any): Promise<any> {
    try{
    const _ingredientService = new IngredientService();
    const ingredientList = await _ingredientService.getIngredient(req.body)
        return res.jsonp(ingredientList);
      } catch(error){
       AppLogger.error('getIngredients', error)
       Api.invalid(req, res, {message: 'Ingredients List Failed'})
      }
    }

       
  public async uniqueValidation(req: any, res: any): Promise<any> {
      const _ingredientService = new IngredientService();
      await _ingredientService
        .uniqueValidation(req.body)
        .then((data) => {
          return res.jsonp(data);
        });
    } 
  public async addIngredients(req, res): Promise<any> {
    try{
    const ingredientServices = new IngredientService();
    await ingredientServices.addIngredient(req.body)
        .then((ingredientList) => {
            Api.ok(req, res, { message: 'Ingredient added successfully.' })
        })
      }catch(error){
            AppLogger.error('addIngredientCategory', error)
            if(error.name === 'SequelizeValidationError') {
                Api.invalid(req, res, {
                  message: error.errors[0].message
                })
              } else {
                Api.badRequest(req, res, { message: 'Ingredient add Failed.' })
              }
        }
      }
   
   
    public async editIngredients(req: any, res: any): Promise<any> {
      try{
    const _ingredientService = new IngredientService();
    const getIngrentsList = await _ingredientService
      .editIngredient(req.params.id)
      .then((data) => {
        Api.ok(req, res, data);
      })
    }catch(err){
        Api.invalid(req, res, { message: "Ingredient Getting Failed." });
        AppLogger.error("addIngredients", err);
      }
  }
  public async viewIngredient(req, res: any): Promise<any> {
    const _ingredientService = new IngredientService();
    await _ingredientService.viewIngredient(req.params.id)
    .then(data => Api.ok(req, res, data))
    .catch(err => Api.badRequest(req, res, err))
  }

  public async updateIngredient(req, res): Promise<any> {
    try{
    const ingredientServices = new IngredientService();
    await ingredientServices
      .updateIngredient(req.body)
      .then((ingredientList) => {
          Api.ok(req, res, {
          message: ingredientList,
        });
      })
    }catch(error){
        AppLogger.error("deletedIngredients", error);
        Api.invalid(req, res, {
          message: "Ingredient update Failed.",
        });
      }
  }
  public async deleteIngredient(req, res): Promise<any> {
    try{
    const ingredientServices = new IngredientService();
    await ingredientServices
      .deleteIngredient(req.body.sno)
      .then((ingredientList) => {
        Api.ok(req, res, {
          message: "Ingredients deleted successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedIngredients", error);
        Api.invalid(req, res, {
          message: "Ingredients deleted Failed.",
        });
      }
  }

  // public async downloadPDF(req: any, res: any): Promise<any> {
  //   try {
  //     console.log('Sachu',req.params.id)
  //     const ingredientServices = new IngredientService();
  //     const pdfContent = await ingredientServices.downloadIngredientPDF(req.params.id);
  //     res.setHeader('Content-Type', 'application/pdf');
  //     res.setHeader('Content-Disposition', 'attachment; filename=IngredientView.pdf');
  //     res.send(Buffer.from(pdfContent));
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // }

  
  public async uploadCSV(req: any, res: any): Promise<any>{
    if (!req.files || !req.files.file) {
      res.status(404)
      .send('File not found');
      } else if (req.files.file.mimetype === 'text/csv') {
      const csvFile = req.files.file;
      const data = this.convert(csvFile);
      try{
        await this._ingredientService.uploadCSV(data);
        res.send(data);
      }
      catch (error) {
        res.status(500).json({ message: 'Error uploading CSV.' });
      }
    } else {
      res.status(400).json({ message: 'Upload CSV Failed.' });
    }
}

  

  public async downloadCSV(req: any, res: any): Promise<any> {
    try{
    const _ingredientService = new IngredientService();
    const _helper = new PostgresqlHelper();
    await _ingredientService
      .getAllIngredient()
      .then((data) => {
        const fields = [
          {
            label: "sno",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Ingredient Category",
            value: "ingredient_category.ingredient_category",
          },
          {
            label: "Supplier Name",
            value: "supplier.supplier",
          },
          {
            label: "Brand Name",
            value: "name",
          },
          {
            label: "Quantity",
            value: "quantity",
          },
          {
            label: "Measurement Unit",
            value: "measurement_name.measurement_name",
          },
          {
            label: "Form",
            value: "form.form",
          },
          {
            label: "Unit Size",
            value: "unit_size",
          },
          {
            label: "Cost per unit",
            value: "cost_per_unit",
          },
          {
            label: "Conversion",
            value: "conversion",
          },
          {
            label: "Food Category",
            value: "food_category.food_category",
          },
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Ingredient.csv",
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

  public async getAllBrandName(req, res): Promise<any> {
    try{
    const _ingredientService = new IngredientService();
    await _ingredientService.getAllIngredientBrandName().then((ingredientName) => {
      Api.ok(req, res, {ingredientName: ingredientName });
    })
  }catch(err) {
      Api.invalid(req, res, { message: "Ingredient category add Failed." });
      AppLogger.error("addIngredientsCategory", err);
    }
  }

  public async getIngredientWithBrandName(req, res): Promise<any> {
    try{
    const _ingredientService = new IngredientService();
    await _ingredientService.getFilterIngredient(req.body).then(data => {
      Api.ok(req, res, data);
    })
  }catch(err){
      Api.invalid(req, res, { message: "Ingredient category add Failed." });
      AppLogger.error("addIngredientsCategory", err);
    }
  }

}
