
import { Router, Request, Response } from "express";
import { RecipeInfoService } from "../../services";
import { AppRoute } from "../../app-route";
import AppLogger from "../../helper/app-logger";
import { Api, decrypted, encrypted, PostgresqlHelper } from "../../helper";
import * as multer from 'multer';
import { Sequelize } from "sequelize-typescript";
import * as path from 'path';
import { RecipeEditModel } from "../../model";
import * as fs from 'fs';
import { FileFilterCallback } from "multer";
import csvParser from 'csv-parser';


export class RecipeInfoController implements AppRoute {
  route = "/recipe_info";
  router: Router = Router();

  private readonly DIR = './src/upload/recipe/images';
  private readonly strorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.DIR)
    },
    filename: (req, file, cb) => {
      const fileName = file.fieldname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname);
      console.log(fileName)
      cb(null, fileName)
    }
  });
  private readonly upload = multer({
    storage: this.strorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  })

  //videos

  private readonly DIR2 = './src/upload/recipe/videos';
  private readonly strorage2 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.DIR2)
    },
    filename: (req, file, cb) => {
      const fileName = file.fieldname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname);
      console.log(fileName)
      cb(null, fileName)
    }
  });
  private readonly upload2 = multer({
    storage: this.strorage2,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "video/mp4" || file.mimetype == "video/ogg" || file.mimetype == "video/webm") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .mp4, .ogg and .webm format allowed!'));
      }
    }
  })

  //upload csv

  private readonly DIR3 = './src/upload/recipe/csv';
  private readonly strorage3 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.DIR3)
    },
    filename: (req, file, cb) => {
      const fileName = file.fieldname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname);
      console.log(fileName)
      cb(null, fileName)
    }
  });
  private readonly upload3 = multer({
    storage: this.strorage3,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "text/csv") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .csv format allowed!'));
      }
    }
  })

  constructor() {
    this.router.post("/getRecipeInfo", this.getRecipeInfo);
    this.router.get("/editRecipeInfo/:id", this.editRecipeInfo);
    this.router.post("/addRecipe", this.addRecipeInfo);
    this.router.put("/updateRecipeInfo", this.updateRecipeInfo);
    this.router.put("/deleteRecipeInfo", this.deleteRecipeInfo);
    this.router.get("/getAllRecipeInfo", this.downloadCSV);
   
    this.router.get("/viewRecipeInfo/:id", this.viewAllRecipeInfo);
    this.router.get("/viewRecipeInfoMob/:id", this.viewAllRecipeInfoMob);


    this.router.post("/getRecipeIngt", this.getRecipeIngt);
    this.router.post("/addRecipeIngt", this.addRecipeIngredient);
    this.router.get("/editRecipeIngt/:id", this.editRecipeIngt);
    this.router.put("/updateRecipeIngt", this.updateRecipeIngt);
    this.router.put("/deleteRecipeIngt", this.deleteRecipeIngt);

    this.router.post("/getRecipeAltIngt", this.getRecipeAltIngt);
    this.router.post("/addRecipeAltIngt", this.addRecipeAltIngredient);
    this.router.get("/editRecipeAltIngt/:id", this.editRecipeAltIngt);
    this.router.put("/deleteRecipeAltIngt", this.deleteRecipeAltIngt);

    this.router.post("/getRecipeCook", this.getRecipeCookMthd);
    this.router.post("/addRecipeCookMthd", this.addRecipeCookMtd);
    this.router.get("/editRecipeCookMthd/:id", this.editRecipeCookingMtd);
    this.router.put("/updateRecipeCook", this.updateRecipeCookMtd);
    this.router.get("/deleteRecipeCook", this.deleteRecipeCookMthd);

    this.router.post("/getCookingTips", this.getCookingTips);
    this.router.post("/addCookingTips", this.addCookingTips);
    this.router.get("/editCookingTips/:id", this.editRecipeCookTips);
    this.router.put("/updateCookTips", this.updateRecipeTips);
    this.router.get("/deleteCookTips", this.deleteRecipeTips);

    this.router.post("/uploadImage", this.upload.array('recipe', 6), this.uploadImage);
    this.router.post("/updateImage", this.upload.array('recipe', 6), this.updateImage);
    this.router.post("/updateImageName", this.updateImages);

    this.router.post("/uploadVideo", this.upload2.single('recipe'), this.uploadVideo);
    this.router.post("/uploadCSV", this.upload3.single('csv'), this.uploadCsv);

    this.router.get("/editRecipes/:id", this.editAllRecipes);
    this.router.post('/unique', this.uniqueValidation);

    this.router.delete("/deleteRecipeImage/:imageName", this.deleteRecipeImage);
    this.router.delete("/deleteRecipeVideo/:videoName", this.deleteRecipeVideo);
    this.router.get('/getAllRecipe', this.getAllRecipes);
    this.router.post('/getRecipebyFilter', this.getRecipesByFilters);
    this.router.get('/getRecipebyDietary', this.getRecipesVsDietary);
    this.router.post('/getRecipeCount', this.getRecipeCount)
    this.router.post('/getNutritionRichRecipes', this.getnutritionRichRecipes);
    this.router.post('/getMostlyConsumedRecipes', this.getmostlyConsumedRecipe);
    this.router.post('/getMostlyLikedRecipes', this.getmostlyLikedRecipes)
  }

  public updateImage(req, res) {
    const imageName = req.files[0].filename;
    res.json({ imageName })
  }

  public async updateImages(req: Request, res: Response): Promise<void> {
    const { recipeId, imgData } = req.body;
    try {
      const recipeInfoService = new RecipeInfoService();
      await recipeInfoService.updateImages(recipeId, imgData);
      res.json({ message: 'Images Updated Successfully' });
    } catch (error) {
      console.error('Error updating images:', error);
      res.status(500).json({ error: 'Error updating images.' });
    }
  }

  public async getAllRecipes(req: Request, res: Response): Promise<void> {
    const recipeInfoService = new RecipeInfoService();
    const limit = req.query.limit;
    const recipes = await recipeInfoService.getAllRecipes(limit);
    res.json(recipes);
  }

  public async getRecipeInfo(req: any, res: any): Promise<any> {
    const _recipeinfoService = new RecipeInfoService();
    try {
      await _recipeinfoService
        .getRecipeInfo(req.body)
        .then((data) => {
          return res.jsonp(data);
        });
    }
    catch (err) {
      console.error(err);
    }

  }

  public async getmostlyLikedRecipes(req: Request, res: Response): Promise<void> {
    const { sd, ed } = req.body;
    try {
      const recipeInfoService = new RecipeInfoService();
      const count = await recipeInfoService.mostlyLikedRecipes(sd, ed);
      res.json({ count });
    } catch (error) {
      console.error('Error fetching mostly liked recipes count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  public async getRecipesVsDietary(req: any, res: any) {
    try {
      const _recipeInfoService = new RecipeInfoService();
      const recipesVsDietary = await _recipeInfoService.getRecipesVsDietary();
      return res.status(200).json(recipesVsDietary);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  public async getRecipeCount(req: any, res: any): Promise<void> {
    console.log('called',req.body)
    const { sd, ed } = req.body;
    try {
      const recipeInfoService = new RecipeInfoService();
      const { year } = req.query;
      const count = await recipeInfoService.getAllRecipesCount(sd, ed);
      res.json(count);
    } catch (error) {
      console.error('Error fetching recipe count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async uniqueValidation(req: any, res: any): Promise<any> {
    const _recipeinfoService = new RecipeInfoService();
    await _recipeinfoService
      .uniqueValidation(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async getRecipesByFilters(req: any, res: any) {
    try {
      const _recipeInfoService = new RecipeInfoService();
      const { search } = req.body;
      const recipes = await _recipeInfoService.getRecipesByFilters(req.body.filterFields, search);
      return res.status(200).json(recipes);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  public async addRecipeInfo(req: any, res: any): Promise<any> {
    try {
      const _recipeinfoService = new RecipeInfoService();
      await _recipeinfoService.addRecipeInfo(req.body).then((recepeId) => {
          Api.ok(req, res, {
            message: 'Success',
            recipe: recepeId['dataValues']
          })
        })
    } catch (error) {
      AppLogger.error('recepie add', error)
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

  public async editRecipeInfo(req: any, res: any): Promise<any> {
    const _recipeService = new RecipeInfoService();
    const getRecipeInfoList = await _recipeService
      .editRecipeInfo(req.params.id)
      .then((data) => {
        return res.jsonp(RecipeEditModel.create(data));
      });
  }

  public async viewAllRecipeInfo(req, res: any): Promise<any> {
    const _recipeService = new RecipeInfoService();
    await _recipeService.viewAllRecipeInfo(req.params.id)
      .then(data => Api.ok(req, res, data))
      .catch(err => Api.badRequest(req, res, err))
  }

  public async viewAllRecipeInfoMob(req, res: any): Promise<any> {
    const id = encrypted(req.params.id);
    const _recipeService = new RecipeInfoService();
    await _recipeService.viewAllRecipeInfo(id)
      .then(data => Api.ok(req, res, data))
      .catch(err => Api.badRequest(req, res, err))
  }

  public async updateRecipeInfo(req, res): Promise<any> {
    try {
      const recipeinfoServices = new RecipeInfoService();
      await recipeinfoServices
        .updateRecipeInfo(req.body)
        .then((recipeList) => {
          if (recipeList.name === 'SequelizeValidationError') {
            Api.invalid(req, res, {
              message: recipeList.errors[0].message
            })
          } else {
            Api.ok(req, res, {
              message: "Recipe Info updated successfully",
            });
          }

        })
    } catch (error) {
      AppLogger.error('recepie updated', error)
      if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message
        })
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'Recipe Info updated Failed.'
        })
      }
    }
  }

  public async uploadCsv(req, res, next): Promise<any> {
    if (req.file) {
      console.log(req.file.filename);
      Api.ok(req, res, {
        message: ["Success"],
      });
    } else {
      console.error('Error uploading CSV file.');
      Api.invalid(req, res, {
        message: "Error uploading CSV file.",
      });
    }
  }


  public async deleteRecipeInfo(req, res): Promise<any> {
    try {
      const recipeinfoServices = new RecipeInfoService();
      await recipeinfoServices
        .deleteRecipeInfo(req.body.recipe_info_id)
        .then((recipeList) => {
          Api.ok(req, res, {
            message: "Recipe Info deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedRecipes", error);
      Api.invalid(req, res, {
        message: "Recipe Info deleted Failed.",
      });
    }
  }

  public async getRecipeIngt(req: any, res: any): Promise<any> {
    try {
      const _recipeinfoService = new RecipeInfoService();
      return await _recipeinfoService.getRecipeIngt(req.body)
        .then((data) => {
          Api.ok(req, res, data)
        })
    } catch (error) {
      AppLogger.error('getRecipeIngt', error)
      Api.invalid(req, res, { message: 'Recipe Ingredient List Failed' })
    }
  }

  public async addRecipeIngredient(req: any, res: any): Promise<any> {
    try {
      const _recipeinfoService = new RecipeInfoService();
      await _recipeinfoService.addRecipeIngt(req.body)
        .then((recepeId) => {
          Api.ok(req, res, {
            message: 'Success',
          })
        })
    }
    catch (error) {
      AppLogger.error('recepie ingredient add', error)
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

  public async updateRecipeIngt(req: any, res: any): Promise<any> {
    try {
      const _recipeinfoService = new RecipeInfoService();
      await _recipeinfoService.updateRecipeIngt(req.body)
        .then((recepeId) => {
          Api.ok(req, res, {
            message: 'Success',
          })
        })
    }
    catch (error) {
      AppLogger.error('recepie ingredient add', error)
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
  public async editRecipeIngt(req: any, res: any): Promise<any> {
    const _recipeService = new RecipeInfoService();
    const getRecipeIngtList = await _recipeService
      .editRecipeIngt(req.params.recipe_ing_id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async deleteRecipeIngt(req, res): Promise<any> {
    try {
      const recipeinfoServices = new RecipeInfoService();
      await recipeinfoServices
        .deleteRecipeIngt(req.body.recipe_ing_id)
        .then((recipeList) => {
          Api.ok(req, res, {
            message: "Recipe ingredient deleted successfully.",
          });
        })
    }
    catch (error) {
      AppLogger.error("deletedRecipe ingredient", error);
      Api.invalid(req, res, {
        message: "Recipe ingredient deleted Failed.",
      });
    }
  }



  public async getRecipeAltIngt(req: any, res: any): Promise<any> {
    try {
      const _recipeinfoService = new RecipeInfoService();
      return await _recipeinfoService.getRecipeAltIngt(req.body)
        .then((data) => {
          Api.ok(req, res, data)
        })
    }
    catch (error) {
      AppLogger.error('getRecipeAltIngt', error)
      Api.invalid(req, res, { message: 'Recipe Alternative Ingredient List Failed' })
    }
  }

  public async addRecipeAltIngredient(req: any, res: any): Promise<any> {
    try {
      const _recipeinfoService = new RecipeInfoService();
      await _recipeinfoService.addRecipeAltIngt(req.body)
        .then((recepeId) => {
          Api.ok(req, res, {
            message: 'Recipe Alternative Ingredient added Successfully.'
          })
        })
    } catch (error) {
      AppLogger.error('recepie alternative ingredient add', error)
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

  public async editRecipeAltIngt(req: any, res: any): Promise<any> {
    const _recipeService = new RecipeInfoService();
    const getRecipeAltIngtList = await _recipeService
      .editRecipeAltIngt(req.params.alt_ing_id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async deleteRecipeAltIngt(req, res): Promise<any> {
    try {
      const recipeinfoServices = new RecipeInfoService();
      await recipeinfoServices
        .deleteRecipeAltIngt(req.body.alt_ing_id)
        .then((recipeList) => {
          Api.ok(req, res, {
            message: "Recipe Alternative ingredient deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedRecipe Alternative ingredient", error);
      Api.invalid(req, res, {
        message: "Recipe alternative ingredient deleted Failed.",
      });
    }
  }


  public async getRecipeCookMthd(req: any, res: any): Promise<any> {
    const _recipeinfoService = new RecipeInfoService();
    await _recipeinfoService
      .getRecipeCookMthd(req.body)
      .then(data => {
        return res.jsonp(data);
      });
  }

  public async addRecipeCookMtd(req: any, res: any): Promise<any> {
    try {
      const _recipeinfoService = new RecipeInfoService();
      await _recipeinfoService.addRecipeCookMthd(req.body)
        .then((recepeId) => {
          Api.ok(req, res, {
            message: 'Success',
          })
        })
    } catch (error) {
      AppLogger.error('recepie cooking method add', error)
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

  public async editRecipeCookingMtd(req: any, res: any): Promise<any> {
    const _recipeService = new RecipeInfoService();
    const getRecipeInfoList = await _recipeService
      .editRecipeCookMtd(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async updateRecipeCookMtd(req, res): Promise<any> {
    try {
      const recipeinfoServices = new RecipeInfoService();
      await recipeinfoServices
        .updateRecipeCookMtd(req.body)
        .then((recipeList) => {
          console.log(recipeList)
          Api.ok(req, res, {
            message: "Recipe Cooking Method updated successfully",
          });
        })
    } catch (error) {
      console.log(error)
      AppLogger.error("deletedRecipe", error);
      Api.invalid(req, res, {
        message: "Recipe Cooking Method updated Failed.",
      });
    }
  }

  public async deleteRecipeCookMthd(req, res): Promise<any> {
    try {
      const recipeinfoServices = new RecipeInfoService();
      await recipeinfoServices
        .deleteRecipeCookMthd(req.body.cooking_method_id)
        .then((recipeList) => {
          Api.ok(req, res, {
            message: "Recipe Cooking Method deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedRecipe Cooking Method", error);
      Api.invalid(req, res, {
        message: "Recipe Cooking Method deleted Failed.",
      });
    }
  }



  public async getCookingTips(req: any, res: any): Promise<any> {
    const _recipeinfoService = new RecipeInfoService();
    await _recipeinfoService
      .getCookingTips(req.body)
      .then(data => {
        return res.jsonp(data);
      });
  }


  public async addCookingTips(req: any, res: any): Promise<any> {
    try {
      const _recipeinfoService = new RecipeInfoService();
      await _recipeinfoService.addCookingTip(req.body)
        .then((receipeId) => {
          Api.ok(req, res, {
            message: 'Success',
            recipe: receipeId['dataValues']
          })
        })
    } catch (error) {
      AppLogger.error('Tips add', error)
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
  public async editRecipeCookTips(req: any, res: any): Promise<any> {
    const _recipeService = new RecipeInfoService();
    const getRecipeInfoList = await _recipeService
      .editCookingTips(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async updateRecipeTips(req, res): Promise<any> {
    try {
      const recipeinfoServices = new RecipeInfoService();
      await recipeinfoServices
        .updateCookingTips(req.body)
        .then((recipeList) => {
          Api.ok(req, res, {
            message: "Recipe Cooking Tips updated successfully",
          });
        })
    } catch (error) {
      console.log(error)
      AppLogger.error("deletedRecipeTips", error);
      Api.invalid(req, res, {
        message: "Recipe Cooking Tips updated Failed.",
      });
    }
  }

  public async deleteRecipeTips(req, res): Promise<any> {
    try {
      const recipeinfoServices = new RecipeInfoService();
      await recipeinfoServices
        .deleteCookingTips(req.body.tips_id)
        .then((recipeList) => {
          Api.ok(req, res, {
            message: "Recipe Cooking Tips deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedRecipe Tips", error);
      Api.invalid(req, res, {
        message: "Recipe Cooking Tips deleted Failed.",
      });
    }
  }


  public async uploadImage(req, res, next): Promise<any> {
    try {
      const _recipeService = new RecipeInfoService();
      console.log(req.body.uploadImageId)
      const queryType = req.body.uploadImageId !== 'null' ? 'update' : 'create';
      console.log(req.body, queryType)
      await _recipeService.uploadImages(req.files[0].filename, req.body.image_type,
        parseInt(req.body.recipeInfo_id), queryType,
        parseInt(req.body.uploadImageId))
        .then(val => { Api.ok(req, res, { message: 'success', images: val.dataValues }) })
    }
    catch (error) {
      Api.badRequest(req, res, {
        message: 'failed', error: error
      })
    }
  }

  public async uploadVideo(req, res, next): Promise<any> {
    const _recipeService = new RecipeInfoService();
    const url = req.protocol + '://' + req.get('host');
    const queryType = req.body.recipeVideo_id !== 'null' ? 'update' : 'create';
    await _recipeService.uploadVideos(req.file.filename, parseInt(req.body.recipeInfo_id), queryType, parseInt(req.body.recipeVideo_id))
      .then(val => { Api.ok(req, res, { message: 'success', video: val.dataValues }) });
  }



  public async downloadCSV(req: any, res: any): Promise<any> {
    try {
      const _recipeService = new RecipeInfoService();
      const _helper = new PostgresqlHelper();
      await _recipeService
        .getAllRecipeInfo()
        .then((data) => {
          const fields = [
            {
              label: "recipe_info_id",
              value: (row, field) => decrypted(row[field.label]),
            },
            {
              label: "Recipe Name",
              value: "recipe_name",
            },
            {
              label: "Dietary",
              value: (row) => {
                const dietaryValues = row.dietary.map((d) => d.dietary_details.dietary);
                return dietaryValues.join(", ");
              },
            },
            {
              label: "Allergen",
              value: (row) => {
                const allergenValues = row.allergen.map((d) => d.allergen_details.allergen);
                return allergenValues.join(", ");
              },
            },
            {
              label: "Highly Nutritional",
              value: (row) => {
                const highlyNutriValues = row.highly_nutritional.map((d) => d.highly_details.highly_nutritional);
                return highlyNutriValues.join(", ");
              },
            },
            {
              label: "Preparation Time",
              value: "preparation_time",
            },
            {
              label: "Cooking Time",
              value: "cooking_time",
            },
            {
              label: "Calories",
              value: "calories",
            },
            {
              label: "Age Group",
              value: (row) => {
                const ageGrpValues = row.age_group.map((d) => d.age_group_details.age_group);
                return ageGrpValues.join(", ");
              },
            },
            {
              label: "Meal Type",
              value: "mealType.meal_type",
            },
            {
              label: "No Of Serves",
              value: "no_of_serves",
            },
            {
              label: "Nutrition Category",
              value: (row) => {
                const nutriCatValues = row.nutrition_category.map((d) => d.nutritional_details.nutrition_category);
                return nutriCatValues.join(", ");
              },
            },
            {
              label: "Difficulty Level",
              value: "difficulty_level",
            },
            {
              label: "Meal Time",
              value: "meal_time",
            },
          ];
          const FileDetails = {
            contentType: "text/csv",
            fileName: "Recipe.csv",
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
    } catch (e) {
      res.status(400).send({
        success: false,
        code: 400,
        error: {
          description: e?.errors?.customsCode?.message || e.message,
        },
      });
    }
  }

  public async editAllRecipes(req: any, res: any): Promise<any> {
    const _recipeService = new RecipeInfoService();
    const getRecipeInfoList = await _recipeService
      .editAllRecipes(req.params.id)
      .then((data) => {
        return Api.ok(req, res, data.map(list => RecipeEditModel.create(list.dataValues)));
      });
  }


  public async deleteRecipeImage(req: Request, res: Response): Promise<void> {
    const imageName = req.params.imageName;
    try {
      fs.unlink(`./src/upload/recipe/images/${imageName}`, (err) => {
        if (err) {
          console.error(err);
          return Api.badRequest(req, res, { message: `${imageName} is not deleted` });
        }
        Api.ok(req, res, { message: `Deleted ${imageName} is successfully.` });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }

  public async deleteRecipeVideo(req: Request, res: Response): Promise<void> {
    const videoName = req.params.videoName;
    try {
      fs.unlink(`./src/upload/recipe/videos/${videoName}`, (err) => {
        if (err) {
          console.error(err);
          return Api.badRequest(req, res, { message: `${videoName} is not deleted` });
        }
        Api.ok(req, res, { message: `Deleted ${videoName} is successfully.` });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }

  public async getmostlyConsumedRecipe(req: Request, res: Response): Promise<void> {
    const { sd, ed } = req.body;
    try {
      const recipeInfoService = new RecipeInfoService();
      const count = await recipeInfoService.MostlyConsumedRecipes(sd, ed);
      res.json(count);
    } catch (error) {
      console.error('Error fetching mostly consumed recipes count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getnutritionRichRecipes(req: Request, res: Response): Promise<void> {
    const { sd, ed } = req.body
    try {
      const recipeInfoService = new RecipeInfoService();
      const count = await recipeInfoService.nutritionRichRecipes(sd, ed);
      res.json(count);
    } catch (error) {
      console.error('Error fetching mostly liked recipes count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}
