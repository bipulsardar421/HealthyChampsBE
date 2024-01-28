import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { IngredientCategoryService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";
import { Console } from "console";
import * as fs from "fs";
import * as docx from "docx";

export class IngredientCategoryController implements AppRoute {
  route = "/ingredient-category";
  router: Router = Router();
    
  
  
  
//   const docx = require("docx");
//   const doc = new docx.Document();

// const paragraph = new docx.Paragraph("Hello, World!");
// doc.addParagraph(paragraph);

// const packer = new docx.Packer();
// packer.toBuffer(doc).then((buffer) => {
//    fs.writeFileSync("example.docx", buffer);
// });


    constructor() {
        this.router.post('/get-ingredient-category', this.getIngredientsCategory);
        this.router.post('/add-ingredient-category', this.addIngredientsCategory);
        this.router.put('/delete-ingredient-category', this.deleteIngredientCat);
        this.router.put('/update-ingredient-category', this.updateIngredientCat);
        this.router.get('/allIngredientcat',this.getAllIngredientCat);
        this.router.get('/downloadCSVIngCategory', this.downloadCSV);
    }


  public async getIngredientsCategory(req, res): Promise<any> {
    try{
    const ingredienCategoryServices = new IngredientCategoryService();
    await ingredienCategoryServices
      .getIngredientCategoryList(req.body)
      .then((ingredientCategoryList) => {
        Api.ok(req, res, ingredientCategoryList);
      })
    }catch(error){
        AppLogger.error("getIngredientsCategory", error);
        Api.invalid(req, res, { message: "Ingredient category list Failed." });
      }
  }

  public async addIngredientsCategory(req, res): Promise<any> {
    try{
    const ingredientCategoryServices = new IngredientCategoryService();
    await ingredientCategoryServices.addIngredentCategory(req.body)
        .then((ingredientCategoryList) => {
            Api.ok(req, res, { message: 'Ingredient Category added successfully.' })
        })
      }catch(error){
            AppLogger.error('addIngredientCategory', error)
            if(error.name === 'SequelizeValidationError') {
                Api.invalid(req, res, {
                  message: error.errors[0].message
                })
              } else {
                Api.badRequest(req, res, { message: 'Ingredient Category add Failed.' })
              }
        }
      }

  public async deleteIngredientCat(req, res): Promise<any> {
    try{
    const ingredienCategoryServices = new IngredientCategoryService();
    await ingredienCategoryServices
      .deleteIngredientCat(req.body.id)
      .then((ingredientCategoryList) => {
        Api.ok(req, res, {
          message: "Ingredient category deleted successfully.",
        });
      })
    }catch(error) {
        AppLogger.error("deletedIngredientsCategory", error);
        Api.invalid(req, res, {
          message: "Ingredient category deleted Failed.",
        });
      }
  }

  public async updateIngredientCat(req, res): Promise<any> {
    try{
    const ingredienCategoryServices = new IngredientCategoryService();
    await ingredienCategoryServices
      .updateIngredientCat(req.body)
      .then((ingredientCategoryList) => {
        Api.ok(req, res, {
          message: "Ingredient Category update successfully.",
        });
      })
    }catch(error) {
        AppLogger.error("deletedIngredientsCategory", error);
        Api.invalid(req, res, {
          message: "Ingredient Category update Failed.",
        });
      }
  }

    public async getAllIngredientCat(req, res): Promise<any>{
         try{
        const ingredienCategoryServices = new IngredientCategoryService();
        await ingredienCategoryServices.getIngredientCat().then((allingredientcat) => {
            Api.ok(req, res, allingredientcat)
        })
      }catch(error){
            AppLogger.error('getAllIngredientCat', error)
        }
    }

    public async downloadCSV(req, res): Promise<any> {
      try{
      const ingredienCategoryServices = new IngredientCategoryService();
      const helper = new PostgresqlHelper();
      await ingredienCategoryServices
      .getAllIngredientCategory()
      .then((data) => {
        const fields = [
          {
            label: "ingredient_category_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Ingredient Category",
            value: "ingredient_category",
          },
                     
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Ingredient Category.csv",
          csv: helper.downloadResouce(fields, data),
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
    }catch(e) {
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

