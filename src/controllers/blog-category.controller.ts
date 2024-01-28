import { Router, Request, Response } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { BlogcategoryService } from "../services";
import AppLogger from "../helper/app-logger";


export class BlogCategoryController implements AppRoute {


    route: string = '/blog_category';
    router: Router = Router();
    constructor() {


        this.router.post('/get-blogcategory', this.getBlogcategory);
        this.router.post('/add-blogcategory', this.addBlogcategory);
        this.router.put('/delete-blogcategory', this.deleteBlogcategory);
        this.router.put('/update-blogcategory', this.updateBlogcategory);
        this.router.get('/get_Allblogcategory', this.getAllBlogcategory);

        this.router.get('/download-blogcategory', this.downloadCSV);
        this.router.post('/get-blogcategorybyId', this.getAllBlogCatById);

    }
    public async getBlogcategory(req, res): Promise<any> {
      try{
        const blogcategoryServices = new BlogcategoryService();
        await blogcategoryServices.getBlogcategoryList(req.body)
        .then((blogcategoryList) => {
         Api.ok(req, res, blogcategoryList)
       })
      }catch(error) {
            AppLogger.error('get-blogcategory', error)
            Api.invalid(req, res,  {message: 'Blogcategory list Failed.'})
        }
    }

    public async getAllBlogCatById(req: Request, res: Response): Promise<void> {
      try {
        const blogcategoryServices = new BlogcategoryService();
        const { blogcatId, pageNumber, pageSize, search } = req.body;
  
        const blogCategories = await blogcategoryServices.getAllBlogCatById(blogcatId, pageNumber, pageSize, search );
  
        res.status(200).json(blogCategories);
      } catch (error) {
        console.error('Error fetching blog categories by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
   
    public async addBlogcategory(req, res):  Promise<any> {
      try{
        const blogcategoryServices = new BlogcategoryService();
        await blogcategoryServices.addBlogCategory(req.body)
        .then((blogcategoryList) => {
            Api.ok(req, res, {message: 'Blogcategory add successfully.'})
        })
      }catch(error){
            AppLogger.error('addBlogcategory', error)
            Api.invalid(req, res,  {message: 'Blogcategory add Failed.'})
        }
    }


    public async deleteBlogcategory(req, res): Promise<any> {
      try{
        const blogcategoryServices = new BlogcategoryService();
        await blogcategoryServices.deleteBlogcategory(req.body.id)
        .then((blogcategoryList) => {
            Api.ok(req, res, {message: 'Blogcategory deleted successfully.'})
        })
      }catch(error){
            AppLogger.error('deletedBlogcategory', error)
            Api.invalid(req, res,  {message: 'Blogcategory deleted Failed.'})
        } 
     }
    public async updateBlogcategory(req, res): Promise<any> {
      try{
    const blogcategoryServices = new BlogcategoryService();
    await blogcategoryServices
      .updateBlogcategory(req.body)
      .then((blogcategoryList) => {
        Api.ok(req, res, {
          message: "Blogcategory updated successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedBlogcategory", error);
        Api.invalid(req, res, {
          message: "Blogcategory update Failed.",
        });
      }
      }
    public async downloadCSV(req, res): Promise<any> {
      try{
      const blogcategoryServices = new BlogcategoryService();
      const helper = new PostgresqlHelper();
      await blogcategoryServices
      .getAllBlogcategory()
      .then((data) => {
        const fields = [
          {
            label: "blog_category_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Blog Category",
            value: "blog_category",
          },
                     
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "BlogCategory.csv",
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

  public async getAllBlogcategory(req, res): Promise<any> {
    try{
    const blogcategoryServices = new BlogcategoryService();
    await blogcategoryServices.getAllBlogcategory()
    .then((blogcategory) => {
      Api.ok(req, res, blogcategory)
    })}
    catch(error) {
      AppLogger.error("countryServices", error);
      Api.invalid(req, res, {
        message: "country getting Failed.",
      });
    }
  }
  
  }





