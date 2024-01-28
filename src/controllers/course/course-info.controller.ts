import { Router, Response, Request } from "express";
import { CourseInfoService } from "../../services/course/course-info.service";
import * as createCsvWriter from "csv-writer";
import { AppRoute } from "../../app-route";
import AppLogger from "../../helper/app-logger";
import { Api, decrypted, PostgresqlHelper } from "../../helper";
import * as multer from "multer";
import * as path from 'path';
import { CourseEditModel } from "../../model";
import * as fs from 'fs';



export class CourseInfoController implements AppRoute {
  route = "/course_info";
  router: Router = Router();


  private readonly DIR = './src/upload/course/images';
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

  private readonly DIR2 = './src/upload/course/videos';
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

  constructor() {
    this.router.post("/getCourseInfo", this.getCourseInfo);
    this.router.post("/getCourseInfoMob", this.getCourseInfoMob);

    this.router.post("/addCourseInfo", this.addCourseInfo);
    this.router.get("/editCourseInfo/:id", this.editCourseInfo);
    this.router.put('/deleteCourseInfo', this.deleteCourseInfo);
    this.router.put("/updateCourseInfo", this.updateCourseInfo);
    this.router.get("/downloadCSVCourses/", this.downloadCSV);
    this.router.get("/viewCourseInfo/:id", this.viewAllCourseInfo);

    this.router.post("/getCourseDes", this.getCourseDes);
    this.router.post("/addCourseDes", this.addCourseDes);
    this.router.put('/deleteCourseDes', this.deleteCourseDes);
    this.router.put("/updateCourseDes", this.updateCourseDes);
    this.router.get("/editCourseDes/:id", this.editCourseDes);

    this.router.post("/getCourseSec", this.getCourseSec);
    this.router.post("/addCourseSec", this.addCourseSec);

    this.router.post("/uploadImage", this.upload.array('course', 6), this.uploadImage);
    this.router.post("/updateImage", this.upload.array('course', 6), this.updateImage);
    this.router.post("/updateImageName", this.updateImages);

    this.router.delete("/deleteCourseImage/:imageName", this.deleteCourseImage);
    this.router.delete("/deleteCourseVideo/:videoName", this.deleteCourseVideo);

    this.router.post("/uploadVideo", this.upload2.single('course'), this.uploadVideo);
    this.router.get("/editCourses/:id", this.editAllCourses);
    this.router.post("/addCourseSectionMarkAsRead", this.addMar);
    this.router.post("/getCourseSectionMarkAsRead", this.getMar);

  }

  public async getMar(req: any, res: any): Promise<any> {
    try {
      return res.status(200).json(await (new CourseInfoService()).getMar(req.body));
    } catch (error) {
      console.error('Error in getMar:', error), res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  public async addMar(req: any, res: any): Promise<any> {
    try {
      const { course_info_id, sec_text_id, parent_id } = req.body;
      if (!(await (new CourseInfoService()).getMar({ course_info_id, sec_text_id, parent_id }))) {
        const addedMar = await (new CourseInfoService()).addMar(req.body);
        Api.ok(req, res, addedMar);
      } else {
        res.json('Course already marked as read');
      }
    } catch (error) {
      AppLogger.error('Mark as read add', error);
      if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message,
        });
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'Error',
        });
      }
    }
  }

  public updateImage(req, res) {
    const imageName = req.files[0].filename;
    res.json({ imageName })
  }

  public async updateImages(req: Request, res: Response): Promise<void> {
    const { courseId, imgData } = req.body;
    try {
      const courseInfoService = new CourseInfoService();
      await courseInfoService.updateImages(courseId, imgData);
      res.json({ message: 'Images Updated Successfully' });
    } catch (error) {
      console.error('Error updating images:', error);
      res.status(500).json({ error: 'Error updating images.' });
    }
  }

  public async deleteCourseImage(req: Request, res: Response): Promise<void> {
    const imageName = req.params.imageName;
    try {
      fs.unlink(`./src/upload/course/images/${imageName}`, (err) => {
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

  public async deleteCourseVideo(req: Request, res: Response): Promise<void> {
    const videoName = req.params.videoName;
    try {
      fs.unlink(`./src/upload/course/videos/${videoName}`, (err) => {
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

  public async getCourseInfo(req: any, res: any): Promise<any> {
    const _courseinfoService = new CourseInfoService();
    await _courseinfoService
      .getCourseInfo(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async getCourseInfoMob(req: any, res: any): Promise<any> {
    const _courseinfoService = new CourseInfoService();
    await _courseinfoService
      .getCourseInfoMob(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }



  public async addCourseInfo(req: any, res: any): Promise<any> {
    try {
      const courseinfoService = new CourseInfoService();
      await courseinfoService.addCourseInfo(req.body)
        .then((courseId) => {
          Api.ok(req, res, {
            message: 'Success',
            courses: courseId['dataValues']
          })
        })
    } catch (error) {
      AppLogger.error('course add', error)
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



  public async editCourseInfo(req: any, res: any): Promise<any> {
    const _courseService = new CourseInfoService();
    const getCourseInfoList = await _courseService
      .editCourseInfo(req.params.id)
      .then((data) => {
        return res.jsonp(CourseEditModel.create(data));
      })
  }


  public async deleteCourseInfo(req, res): Promise<any> {
    try {
      const courseinfoService = new CourseInfoService();
      await courseinfoService
        .deleteCourseInfo(req.body.course_info_id)
        .then((courseinfoList) => {
          Api.ok(req, res, {
            message: "Course deleted successfully.",
          });
        })
    }
    catch (error) {
      AppLogger.error("deletedcourse", error);
      Api.invalid(req, res, {
        message: "Course deleted Failed.",
      });
    }
  }




  public async updateCourseInfo(req, res): Promise<any> {
    try {
      const courseinfoService = new CourseInfoService();
      await courseinfoService
        .updateCourseInfo(req.body)
        .then((courseList) => {
          if (courseList.name === 'SequelizeValidationError') {
            Api.invalid(req, res, {
              message: courseList.errors[0].message
            })
          } else {
            Api.ok(req, res, {
              message: "Course Info Updated Successfully",
            });
          }

        })
    }
    catch (error) {
      AppLogger.error('course updated', error)
      if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message
        })
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'Course updated Failed.'
        })
      }
    }
  }


  public async viewAllCourseInfo(req, res: any): Promise<any> {
    const _courseService = new CourseInfoService();
    await _courseService.viewAllCoursesInfo(req.params.id)
      .then(data => Api.ok(req, res, data))
      .catch(err => Api.badRequest(req, res, err))
  }


  public async getCourseDes(req: any, res: any): Promise<any> {
    const courseinfoService = new CourseInfoService();
    await courseinfoService
      .getCourseDes(req.body)
      .then(data => {
        return res.jsonp(data);
      });
  }


  public async addCourseDes(req: any, res: any): Promise<any> {
    try {
      const courseinfoService = new CourseInfoService();
      await courseinfoService.addCourseDes(req.body)
        .then((courseId) => {
          Api.ok(req, res, {
            message: 'Success',
          })
        })
    } catch (error) {
      AppLogger.error('Description add', error)
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

  public async deleteCourseDes(req, res): Promise<any> {
    try {
      const courseinfoService = new CourseInfoService();
      await courseinfoService
        .deleteCourseDes(req.body.course_des_id)
        .then((coursedesList) => {
          Api.ok(req, res, {
            message: "Course Description deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedcourse", error);
      Api.invalid(req, res, {
        message: "Course Description deleted Failed.",
      });
    }
  }

  public async editCourseDes(req: any, res: any): Promise<any> {
    const _courseService = new CourseInfoService();
    const geCourseInfoList = await _courseService
      .editCourseDes(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }


  public async updateCourseDes(req, res): Promise<any> {
    try {
      const courseinfoServices = new CourseInfoService();
      await courseinfoServices
        .updateCourseDes(req.body)
        .then((courseList) => {
          console.log(courseList)
          Api.ok(req, res, {
            message: "Course Description Updated successfully",
          });
        })
    } catch (error) {
      console.log(error)
      AppLogger.error("updated Course", error);
      Api.invalid(req, res, {
        message: "Course Description updated Failed.",
      });
    }
  }


  public async downloadCSV(req, res): Promise<any> {
    try {
      const courseinfoServices = new CourseInfoService();
      const helper = new PostgresqlHelper();
      await courseinfoServices
        .getAllCourseInfo()
        .then((data) => {
          const fields = [
            {
              label: "course_info_id",
              value: (row, field) => decrypted(row[field.label]),
            },
            {
              label: "Course Name",
              value: "course_name",
            },
            {
              label: "Author",
              value: "author",
            },
            {
              label: "Published Date",
              value: "published_date",
            },
            {
              label: "Subscription Type",
              value: "subscription_type",
            },
            {
              label: "No Of Sections",
              value: "no_of_sections",
            },
            {
              label: "Time Duration",
              value: "time_duration",
            },

          ];
          const FileDetails = {
            contentType: "text/csv",
            fileName: "course.csv",
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
  public async uploadImage(req, res, next): Promise<any> {
    try {
      const courseinfoService = new CourseInfoService();
      const reqFiles = []
      const url = req.protocol + '://' + req.get('host');
      console.log(req.body.uploadImageId)
      const queryType = req.body.uploadImageId !== 'null' ? 'update' : 'create';
      console.log(req.body, queryType)
      await courseinfoService.uploadImages(req.files[0].filename, req.body.image_type,
        parseInt(req.body.courseInfo_id), queryType,
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
    const courseinfoService = new CourseInfoService();
    const url = req.protocol + '://' + req.get('host');
    console.log(req.file)
    const queryType = req.body.courseVideo_id !== 'null' ? 'update' : 'create';
    await courseinfoService.uploadVideos(req.file.filename, parseInt(req.body.courseInfo_id), queryType, parseInt(req.body.courseVideo_id))
    .then(val => { Api.ok(req, res, { message: 'success', video: val.dataValues }) });
  }

  public async getCourseSec(req: any, res: any): Promise<any> {
    const courseinfoService = new CourseInfoService();
    await courseinfoService
      .getCourseSec(req.body)
      .then(data => {
        return res.jsonp(data);
      });
  }


  public async addCourseSec(req: any, res: any): Promise<any> {
    try {
      const courseinfoService = new CourseInfoService();
      await courseinfoService.addCourseSec(req.body)
        .then((courseId) => {
          Api.ok(req, res, {
            message: 'Success',
          })
        })
    } catch (error) {
      AppLogger.error('Section add', error)
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

  public async editAllCourses(req: any, res: any): Promise<any> {
    const _courseService = new CourseInfoService();
    const getCourseInfoList = await _courseService
      .editAllCourses(req.params.id)
      .then((data) => {
        return Api.ok(req, res, data.map(list => CourseEditModel.create(list.dataValues)));
      });
  }
}




