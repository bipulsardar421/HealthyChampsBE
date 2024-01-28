import { Router, Request, Response } from "express";
import { WorkshopInfoService } from "../../services";
import * as createCsvWriter from "csv-writer";
import { AppRoute } from "../../app-route";
import AppLogger from "../../helper/app-logger";
import { Api, decrypted, PostgresqlHelper, MailCompliper } from "../../helper";
import * as multer from "multer";
import * as path from "path";
import { WorkshopEditModel } from "../../model/workshop-edit.model";
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as nodeMailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';


export class WorkshopInfoController extends MailCompliper implements AppRoute {
  route = "/workshop_info";
  router: Router = Router();
  _transporter = null;
  private _htmlRedFile: Function = null;
  private _filePath: string = '';
  self = this;

  private readonly DIR = './src/upload/workshop/images';
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

  private readonly DIR2 = './src/upload/workshop/videos';
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
    super();
    this.router.post("/getWorkshopInfo", this.getWorkshopInfo);
    this.router.post("/addWorkshopInfo", this.addWorkshopInfo);
    this.router.get("/editWorkshopInfo/:id", this.editWorkshopInfo);
    this.router.put('/deleteWorkshopInfo', this.deleteWorkshopInfo);
    this.router.put("/updateWorkshopInfo", this.updateWorkshopInfo);
    this.router.get("/viewWorkshopInfo/:id", this.viewAllWorkshopInfo);
    this.router.get("/downloadCSVWorkshopInfo", this.downloadCSV);
    this.router.get("/getUpcomingWorkshop", this.getUpcomingWorkshops);

    //credentials

    this.router.post("/getWorkshopCredentials", this.getWorkshopCredentials);
    this.router.post("/addWorkshopCredentials", this.addWorkshopCredentials);
    this.router.get("/editWorkshopCredentials/:id", this.editWorkshopCredentials);
    this.router.put('/deleteWorkshopCredentials', this.deleteWorkshopCredentials);
    this.router.put("/updateWorkshopCredentials", this.updateWorkshopCredentials);

    //Description

    this.router.post("/getWorkshopDes", this.getWorkshopDes);
    this.router.get("/editWorkshopDes/:id", this.editWorkshopDes);
    this.router.post("/addWorkshopDes", this.addWorkshopDes);
    this.router.put("/updateWorkshopDes", this.updateWorkshopDes);
    this.router.put("/deleteWorkshopDes", this.deleteWorkshopDes);

    
    this.router.post("/uploadImage", this.upload.array('workshop', 6), this.uploadImage);
    this.router.post("/updateImage", this.upload.array('workshop', 6), this.updateImage);
    this.router.post("/updateImageName", this.updateImages);
    this.router.post("/uploadVideo", this.upload2.single('workshop'), this.uploadVideo);
    this.router.get("/editWorkshops/:id", this.editAllWorkshops);

    this.router.delete("/deleteWorkshopImage/:imageName", this.deleteWorkshopImage);
    this.router.delete("/deleteWorskhopVideo/:videoName", this.deleteWorkshopVideo);
    this.router.get('/getAllWorkshop', this.getAllWorkshops);

    this.router.post('/getRegisteredWorkshop', this.getRegisteredWorkshops.bind(this));


    this.filePath = this.filePath
    this._htmlRedFile = this.readHTMLFile
    this._transporter = nodeMailer.createTransport(smtpTransport({
      service: 'gmail',
      port: 465,
      auth: {
        user: "admin.healthychamps@digitranit.com",
        pass: "qnrtsdijchqfiebo",
      }
    }));
  }

  public updateImage(req, res) {
    const imageName = req.files[0].filename;
    res.json({ imageName })
  }

  public async updateImages(req: Request, res: Response): Promise<void> {
    const { workshopId, imgData } = req.body;
    try {
      const workshopInfoService = new WorkshopInfoService();
      await workshopInfoService.updateImages(workshopId, imgData);
      res.json({ message: 'Images Updated Successfully' });
    } catch (error) {
      console.error('Error updating images:', error);
      res.status(500).json({ error: 'Error updating images.' });
    }
  }
  public async getAllWorkshops(req: Request, res: Response): Promise<void> {
    const workshopInfoService = new WorkshopInfoService();
    const limit = req.query.limit;
    const workshops = await workshopInfoService.getAllWorkshops(limit);
    res.json(workshops);
  }

  public async getWorkshopInfo(req: any, res: any): Promise<any> {
    const _workshopinfoService = new WorkshopInfoService();
    await _workshopinfoService
      .getWorkshopInfo(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

    public async getUpcomingWorkshops(req: Request, res: Response): Promise<void> {
    try {
      const workshopinfoServices = new WorkshopInfoService();
      const upcomingWorkshops = await workshopinfoServices.getUpcomingWorkshops();
      res.json(upcomingWorkshops);
    } catch (error) {
      console.error('Error fetching upcoming workshops:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  public async addWorkshopInfo(req: any, res: any): Promise<any> {
    try {
      const workshopinfoServices = new WorkshopInfoService();
      await workshopinfoServices.addWorkshopInfo(req.body)
        .then((workshopId) => {
          Api.ok(req, res, {
            message: 'Success',
            workshop: workshopId['dataValues']

          })
        })
    } catch (error) {
      AppLogger.error('workshop add', error)
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

  public async viewAllWorkshopInfo(req, res: any): Promise<any> {
    const _workshopService = new WorkshopInfoService();
    await _workshopService.viewAllWorkshopInfo(req.params.id)
      .then(data => Api.ok(req, res, data))
      .catch(err => Api.badRequest(req, res, err))
  }

  public async editWorkshopInfo(req: any, res: any): Promise<any> {
    const _workshopService = new WorkshopInfoService();
    const getWorkshopInfoList = await _workshopService
      .editWorkshopInfo(req.params.id)
      .then((data) => {
        return res.jsonp(WorkshopEditModel.create(data));
      });
  }


  public async deleteWorkshopInfo(req, res): Promise<any> {
    try {
      const workshopinfoServices = new WorkshopInfoService();
      await workshopinfoServices
        .deleteWorkshopInfo(req.body.workshop_info_id)
        .then((workshopinfoList) => {
          Api.ok(req, res, {
            message: "Workshop deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedWorkshop", error);
      Api.invalid(req, res, {
        message: "Workshop deleted Failed.",
      });
    }
  }

  public async updateWorkshopInfo(req, res): Promise<any> {
    try {
      const workshopinfoServices = new WorkshopInfoService();
      await workshopinfoServices
        .updateWorkshopInfo(req.body)
        .then((workshopList) => {
          if (workshopList.name === 'SequelizeValidationError') {
            Api.invalid(req, res, {
              message: workshopList.errors[0].message
            })
          } else {
            Api.ok(req, res, {
              message: "Workshop updated successfully",
            });
          }

        })
    } catch (error) {
      AppLogger.error('workshop updated', error)
      if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message
        })
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'Workshop updated Failed.'
        })
      }
    }
  }
  public async getWorkshopDes(req: any, res: any): Promise<any> {
    const _workshopinfoService = new WorkshopInfoService();
    await _workshopinfoService
      .getWorkshopDes(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }
  
  
  public async addWorkshopDes(req: any, res: any): Promise<any> {
    try {
      const _workshopinfoService = new WorkshopInfoService();
      await _workshopinfoService.addWorkshopDes(req.body)
        .then((workshopId) => {
          Api.ok(req, res, {
            message: 'Success'
          })
        })
    } catch (error) {
      AppLogger.error('workshop add', error)
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
  
  public async editWorkshopDes(req: any, res: any): Promise<any> {
    const _workshopService = new WorkshopInfoService();
    const geWorkshopInfoList = await _workshopService
      .editWorkshopDes(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }
  
  public async updateWorkshopDes(req, res): Promise<any> {
    try{
      const workshopinfoServices = new WorkshopInfoService();
      await workshopinfoServices
        .updateWorkshopDes(req.body)
        .then((workshopList) => {
          Api.ok(req, res, {
            message: "workshop description updated successfully",
          });
        })
    } catch (error) {
      console.log(error)
      AppLogger.error("updated workshop description", error);
      Api.invalid(req, res, {
        message: "workshop description updated Failed.",
      });
    }
  }
  
  public async deleteWorkshopDes(req, res): Promise<any> {
    try {
      const workshopinfoServices = new WorkshopInfoService();
      await workshopinfoServices
        .deleteWorkshopDes(req.body.workshop_des_id)
        .then((workshopDesList) => {
          Api.ok(req, res, {
            message: "Workshop Description deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedWorkshop description", error);
      Api.invalid(req, res,
        {
          message: "Workshop description deletion Failed.",
        });
    }
  }

  public async getWorkshopCredentials(req: any, res: any): Promise<any> {
    const _workshopinfoService = new WorkshopInfoService();
    await _workshopinfoService
      .getWorkshopCredentials(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }


  public async addWorkshopCredentials(req: any, res: any): Promise<any> {
    try {
      const workshopinfoServices = new WorkshopInfoService();
      await workshopinfoServices.addWorkshopCredentials(req.body)
        .then((workshopId) => {
          Api.ok(req, res, {
            message: 'Success',

          })
        })
    } catch (error) {
      AppLogger.error('workshop credentials add', error)
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


  public async editWorkshopCredentials(req: any, res: any): Promise<any> {
    const _workshopService = new WorkshopInfoService();
    const getWorkshopCredentialsList = await _workshopService
      .editWorkshopCredentials(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async deleteWorkshopCredentials(req, res): Promise<any> {
    try {
      const workshopcredentialsServices = new WorkshopInfoService();
      await workshopcredentialsServices
        .deleteWorkshopCredentials(req.body.workshop_credentials_id)
        .then((workshopcredentialsList) => {
          Api.ok(req, res, {
            message: "Workshop Credentials deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedWorkshop", error);
      Api.invalid(req, res, {
        message: "Workshop Credentials deleted Failed.",
      });
    }
  }

  public async updateWorkshopCredentials(req, res): Promise<any> {
    try {
      const WorkshopinfoServices = new WorkshopInfoService();
      await WorkshopinfoServices
        .updateWorkshopCredentials(req.body)
        .then((workshopList) => {
          Api.ok(req, res, {
            message: "Workshop Credentials Updated Successfully",
          });
        })
    } catch (error) {
      console.log(error)
      AppLogger.error("deletedWorkshopCredentials", error);
      Api.invalid(req, res, {
        message: "Workshop Credentials updated Failed.",
      });
    }
  }

  public async uploadImage(req, res, next): Promise<any> {
    try {
      const workshopinfoService = new WorkshopInfoService();
      const reqFiles = []
      const url = req.protocol + '://' + req.get('host');
      const queryType = req.body.uploadImageId !== 'null' ? 'update' : 'create';
      await workshopinfoService.uploadImages(req.files[0].filename, req.body.image_type,
        parseInt(req.body.workshopInfo_id), queryType,
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
    const workshopinfoService = new WorkshopInfoService();
    const url = req.protocol + '://' + req.get('host');
    const queryType = req.body.workshopVideo_id !== 'null' ? 'update' : 'create';
    console.log("", queryType)
    await workshopinfoService.uploadVideos(req.file.filename, parseInt(req.body.workshopInfo_id), queryType, parseInt(req.body.workshopVideo_id))
      .then(val => { Api.ok(req, res, { message: 'success', video: val.dataValues }) });
  }


  public async editAllWorkshops(req: any, res: any): Promise<any> {
    const _recipeService = new WorkshopInfoService();
    const getWorkshopInfoList = await _recipeService
      .
      editAllWorkshops(req.params.id)
      .then((data) => {
        return Api.ok(req, res, data.map(list => WorkshopEditModel.create(list.dataValues)));
      });
  }

  public async deleteWorkshopImage(req: Request, res: Response): Promise<void> {
    const imageName = req.params.imageName;
    try {
      fs.unlink(`./src/upload/workshop/images/${imageName}`, (err) => {
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

  public async deleteWorkshopVideo(req: Request, res: Response): Promise<void> {
    const videoName = req.params.videoName;
    try {
      fs.unlink(`./src/upload/workshop/videos/${videoName}`, (err) => {
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


  public async downloadCSV(req: any, res: any): Promise<any> {
    try {
      const workshopinfoService = new WorkshopInfoService();
      const _helper = new PostgresqlHelper();
      await workshopinfoService
        .getAllWorkshopInfo()
        .then((data) => {
          const fields = [
            {
              label: "workshop_info_id",
              value: (row, field) => decrypted(row[field.label]),
            },
            {
              label: "Workshop Title",
              value: "title",
            },
            {
              label: "Start Date",
              value: "start_date",
            },
            {
              label: "End Date",
              value: "end_date",
            },
            {
              label: "Start Time",
              value: "start_time",
            },
            {
              label: "End Time",
              value: "end_time",
            },
            {
              label: "Duration",
              value: "duration",
            },
            {
              label: "Organiser",
              value: "organiser",
            },
            {
              label: "Mode",
              value: "mode",
            },
            {
              label: "Session Type",
              value: "session_type",
            },
            {
              label: "Session Cost",
              value: "session_cost",
            },
          ];
          const FileDetails = {
            contentType: "text/csv",
            fileName: "Workshop.csv",
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

  public async getRegisteredWorkshops(req: any, res: any): Promise<any> {
    const { emailId, workshop_info_id } = req.body;
    const workshopInfoService = new WorkshopInfoService();
    try {
      const credentials = await workshopInfoService.getRegisterWorkshop(workshop_info_id);
      const data = credentials.workshop_credentials;
      const meetingData = ["meeting_link", "meeting_id", "passcode", "location"];
      const meetingTime = ["start_date", "end_date", "start_time", "end_time", "organiser", "mode"];
      const extractedMeetingData = {};
      const extractedData = {}
      meetingData.forEach(property => {
        if (data[0][property] !== "") {
            extractedMeetingData[property] = data[0][property];
        }
    });
    
      meetingTime.forEach(property => {
        extractedData[property] = credentials[property];
      });
      const mergedData = { ...extractedData, ...extractedMeetingData };
      const emailSent = await new Promise<boolean>((resolve) => {
        this._htmlRedFile('src/upload/mail_content/register-workshop.html', async (err, html) => {
          if (err) {
            console.error('Error reading email template:', err);
            resolve(false);
          } else {
            const template = handlebars.compile(html);
            const replacements = {};
            for (const [property, value] of Object.entries(mergedData)) {
              if (value) {
                replacements[property] = value;
              }
            }
            const htmlToSend = template(replacements);
            try {
              await this._transporter.sendMail({
                from: 'admin.healthychamps@digitranit.com',
                to: emailId,
                subject: 'Workshop Registration Details',
                html: htmlToSend,
              });
              resolve(true);
            } catch (error) {
              console.error('Error sending email to parent:', error);
              resolve(false);
            }
          }
        });
      });
  
      if (emailSent) {
        const responseMessage = `Mail Sent with workshop data:`;
        res.json({ message: responseMessage, data: mergedData });
      } else {
        res.json({ message: 'Failed to send email' });
      }
    } catch (error) {
      console.error('Error getting registered workshops of parent:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}  