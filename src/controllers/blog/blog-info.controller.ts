import { Router , Request, Response} from "express";
import { BlogInfoService } from "../../services/blog/blog-info.service";
import * as createCsvWriter from "csv-writer";
import { AppRoute } from "../../app-route";
import AppLogger from "../../helper/app-logger";
import { Api, decrypted, PostgresqlHelper } from "../../helper";
import * as multer from 'multer';
import * as path from 'path';
import { BlogEditModel } from "../../model";
import * as fs from 'fs';
 

 
export class BlogInfoController implements AppRoute {
  route = "/blog_info";
  router: Router = Router();
  
  private readonly DIR = './src/upload/blogs/images';
  private readonly strorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.DIR)
    },
    filename: (req, file, cb) => {
      const fileName = file.fieldname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname);
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

  constructor() {
    this.router.post("/getBlogInfo", this.getBlogInfo);
    this.router.post("/addBlogInfo", this.addBlogInfo);
    this.router.get("/editBlogInfo/:id", this.editBlogInfo);
    this.router.put('/deleteBlogInfo', this.deleteBlogInfo); 
    this.router.put("/updateBlogInfo",this.updateBlogInfo);
    this.router.get('/downloadBlogInfo', this.downloadCSV);

    this.router.post("/uploadImage", this.upload.array('blogs', 6), this.uploadImage);
    this.router.post("/updateImage", this.upload.array('blogs', 6), this.updateImage);
    this.router.post("/updateImageName", this.updateImages);
    
    this.router.get("/viewBlogsInfo/:id", this.viewAllBlogsInfo);
    this.router.get("/editAllBlogs/:id",this.editAllBlogs);
    this.router.delete("/deleteBlogImage/:imageName", this.deleteBlogImage);
    this.router.get('/getAllBlogs', this.getAllBlogs);

  }
 
  public async getAllBlogs(req: Request, res: Response): Promise<void> {
    const blogInfoService = new BlogInfoService();
    const limit = req.query.limit; 
    const blogs = await blogInfoService.getAllBlogs(limit);
    res.json(blogs);
  }


  public async getBlogInfo(req: any, res: any): Promise<any> {
    const _bloginfoService = new BlogInfoService();
    await _bloginfoService
      .getBlogInfo(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }


  public updateImage(req, res) {
    const imageName = req.files[0].filename;
    res.json({ imageName })
  }


  public async updateImages(req: Request, res: Response): Promise<void> {
    const { blogId, imgData } = req.body;
    try {
      const blogInfoService = new BlogInfoService();
      await blogInfoService.updateImages(blogId, imgData);
      res.json({ message: 'Images Updated Successfully' });
    } catch (error) {
      console.error('Error updating images:', error);
      res.status(500).json({ error: 'Error updating images.' });
    }
  }

 
public async addBlogInfo(req: any, res: any): Promise<any> {
  try{
  const _bloginfoService = new BlogInfoService();
  await _bloginfoService.addBlogInfo(req.body)
  .then((blogsId) => {
    Api.ok(req, res, {
      message: 'Success',
      blog: blogsId['dataValues']
       
    })
  })
}catch(error) {
    AppLogger.error('blog add', error)
    if(error.name === 'SequelizeValidationError') {
      Api.invalid(req, res, {
        message: error.errors[0].message})
    } else {
      Api.badRequest(req, res, {
        errorCode: 500,
        message: 'Error'
      })
    }  
  }
}
public async viewAllBlogsInfo(req:any, res: any): Promise<any> {
  const bloginfoService = new BlogInfoService();
  await bloginfoService.viewAllBlogsInfo(req.params.id)
  .then(data => Api.ok(req, res, data))
  .catch(err => Api.badRequest(req, res, err))
}

  public async editBlogInfo(req: any, res: any): Promise<any> {
    const _blogService = new BlogInfoService();
    const getBlogInfoList = await _blogService
    .editBlogInfo(req.params.id)
    .then((data)=>{
      return res.jsonp(data);
    })
  }
  public async deleteBlogInfo(req, res): Promise<any> {
    try{
    const bloginfoService = new BlogInfoService();
    await bloginfoService
    .deleteBlogInfo(req.body.blog_info_id)
    .then((bloginfoList) => {
      Api.ok(req, res, {
        message: "blog deleted successfully.",
      });
    })
  }catch(error) {
      AppLogger.error("deletedblog", error);
      Api.invalid(req, res, {
        message: "blog deleted Failed.",
      });
    }
}

public async updateBlogInfo(req, res): Promise<any> {
  try{
  const recipeinfoServices = new BlogInfoService();
  await recipeinfoServices
    .updateBlogInfo(req.body)
    .then((recipeList) => {
      if (recipeList.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: recipeList.errors[0].message
        })
      } else {
        Api.ok(req, res, {
          message: "Blog updated successfully",
        });
      }
     
    })
  }catch(error) {
    AppLogger.error('Blog updated', error)
      if (error.name === 'SequelizeValidationError') {
      Api.invalid(req, res, {
        message: error.errors[0].message
      })
    } else {
      Api.badRequest(req, res, {
        errorCode: 500,
        message: 'Blog updated Failed.'
      })
    }
    }
}



public async downloadCSV(req, res): Promise<any> {
  try{
    const bloginfoServices = new BlogInfoService();
    const helper = new PostgresqlHelper();
    await bloginfoServices
    .getAllBlogInfo()
    .then((data) => {
      const fields = [
        {
          label: "blog_info_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Blog Title",
          value: "blog_title",
        },
        {
          label: "Blog Category",
          value: "blogcategory.blog_category",
        },
        {
          label: "Published Date",
          value: "published_date",
        },
        {
          label: "Author",
          value: "author",
        },
        {
          label: "Content",
          value: "content",
        },
                   
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "Blogs.csv",
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
public async uploadImage(req, res, next): Promise<any> {
  try {
    const _blogService = new BlogInfoService();
    //  const reqFiles = [] 
    //  const url = req.protocol + '://' + req.get('host');
      console.log(req.body.uploadImageId)
      const queryType = req.body.uploadImageId !== 'null' ? 'update' : 'create'; 
      console.log(req.body, queryType)
      await _blogService.uploadImages(req.files[0].filename, req.body.image_type,
       parseInt(req.body.blogInfo_id), queryType,
        parseInt(req.body.uploadImageId) )
       .then(val =>
         { Api.ok(req, res, { message: 'success', images: val.dataValues }) })
   } 
  catch (error) 
    { 
      Api.badRequest(req, res,{ 
      message: 'failed', error: error
    }) 
  }
}
public async editAllBlogs(req: any, res: any): Promise<any> {
  const _blogService = new BlogInfoService();
  const getWorkshopInfoList = await _blogService
    .
    editAllBlogs(req.params.id)
    .then((data) => {
      return Api.ok(req, res, data.map(list => BlogEditModel.create(list.dataValues)));
    });
  }

  public async deleteBlogImage(req: Request, res: Response): Promise<void> {
    const imageName = req.params.imageName;
    try {
      fs.unlink(`./src/upload/blogs/images/${imageName}`, (err) => {
        if (err) {
          console.error(err);
          return Api.badRequest(req, res, {message: `${imageName} is not deleted`});
        }
        Api.ok(req, res, {message: `Deleted ${imageName} is successfully.`});
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }
 
}


