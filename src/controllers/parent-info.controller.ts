import { Router, Request, Response } from "express";
import { Api, decrypted, EncriptPasswordHelper, MailCompliper, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { ChildInfoService, ParentInfoService } from "../services";
import AppLogger from "../helper/app-logger";
import { ChildInfoDBModel, ParentProfileImageDBModel } from "../db-models";
import * as handlebars from 'handlebars';
import * as nodeMailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as multer from "multer";
import * as path from "path";
import * as fs from 'fs';

export class ParentInfoController extends MailCompliper implements AppRoute {
  route = "/parent_info";
  router: Router = Router();
  _parentinfoService: ParentInfoService = null;
  private _htmlRedFile: Function = null;
  _transporter = null;
  private _filePath: string = '';
  self = this;
  childInfoService: ChildInfoService = null;

  private readonly DIR = './src/upload/parent/images';
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

  constructor() {
    super();
    this.router.post("/getParentInfo", this.getParentInfo);
    this.router.post("/addParentInfo", this.addParentInfo.bind(this));
    this.router.post("/addParentInfoMobile", this.addParentInfoMobile.bind(this));
    this.router.put('/deleteParentInfo', this.deleteParentInfo);
    this.router.get("/viewParentInfo/:id", this.viewAllParentInfo);
    this.router.get("/editParentInfo/:id", this.editParentInfo);
    this.router.put('/updateParentInfo', this.updateParentInfo);
    this.router.get("/downloadCSVParentInfo/", this.downloadCSVParentInfo);
    this.router.get('/getAllParentInfo', this.getAllParentInfo);

    this.router.post("/uploadImage", this.upload.array('parent', 1), this.uploadImage);
    this.router.delete("/deleteProfileImage/:imageName", this.deleteProfileImage);
    this.router.post('/unique', this.uniqueValidation);
    this.router.post('/forgotpass', this.forgotpassword.bind(this));
    this.router.post('/getExistingParent', this.getExistingParent.bind(this));

    this._parentinfoService = new ParentInfoService();
    this._filePath = this.filePath;
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

  public async uploadImage(req, res, next): Promise<any> {
    try {
      const _parentInfoService = new ParentInfoService();
      const queryType = req.body.uploadImageId !== 'null' ? 'update' : 'create';
      await _parentInfoService.uploadImages(
        req.files[0].filename,
        req.body.image_type,
        req.body.parentInfo_id,
        queryType,
        decrypted(req.body.uploadImageId)
      ).then(val => {
        Api.ok(req, res, { message: 'success', images: val.dataValues, fileName: req.files[0].filename });
      });
    } catch (error) {
      Api.badRequest(req, res, {
        message: 'failed',
        error: error
      });
    }
  }


  public async deleteProfileImage(req: Request, res: Response): Promise<any> {
    const imageName = req.params.imageName;
    try {
      const ps = new ParentInfoService();
      await ps.deleteImg(imageName)

      fs.unlink(`./src/upload/parent/images/${imageName}`, async (err) => {
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

  public async getExistingParent(req: any, res: any): Promise<any> {
    const { emailId, centreId } = req.body;
    const _parentinfoService = new ParentInfoService();
    const length = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    try {
      const existingParent = await _parentinfoService.getExistingParent(emailId, centreId);
      if (existingParent) {
        await this._parentinfoService.forgotpassowrd(emailId, password)
        const emailContent = `Hello ${existingParent.name}, your parent data is found!`;
        const emailSubject = 'Parent Data Found';
        const content = '';
        const emailSent = await new Promise<boolean>((resolve) => {
          this._htmlRedFile(this._filePath + '/otp.html', async (err, html) => {
            if (err) {
              console.error('Error reading email template:', err);
              resolve(false);
            } else {
              const template = handlebars.compile(html);
              const replacements = {
                userId: emailId,
                tempPass: password
              };
              const htmlToSend = template(replacements);
              try {
                await this._transporter.sendMail({
                  from: 'admin.healthychamps@digitranit.com',
                  to: emailId,
                  subject: emailSubject,
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
          res.json(existingParent);
        } else {
          res.status(500).json({ error: 'Failed to send email to parent.' });
        }
      } else {
        res.json('No parent found');
      }
    } catch (error) {
      console.error('Error getting existing parent:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async forgotpassword(req: any, res: any): Promise<any> {
    try {
      console.log(req.body.email_address)
      const length = 10;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      await this._parentinfoService.validEmail(req.body.email_address)
        .then(async (data) => {
          if (data) {
            await this._parentinfoService.forgotpassowrd(req.body.email_address, password)
              .then(data => {
                if (data) {
                  this._htmlRedFile(this._filePath + '/otp.html', (err, html) => {
                    if (err) {
                      Api.ok(req, res, {
                        message: "Mail sending failed.",
                      });
                      return true
                    }
                    const template = handlebars.compile(html);
                    const replacements = {
                      userId: req.body.email_address,
                      tempPass: password
                    };
                    const htmlToSend = template(replacements);
                    this._transporter.sendMail({
                      from: 'admin.healthychamps@digitranit.com',
                      to: req.body.email_address,
                      subject: 'Healthychamps password change request',
                      html: htmlToSend
                    }, (err, info) => {


                    });
                  })
                  Api.ok(req, res, { message: 'new password send your email' });
                }
              })
              .catch(err => {
                console.log('ddddd', err)
                Api.badRequest(req, res, { message: 'get failed' })
              })
          } else {
            Api.badRequest(req, res, { error_code: 300, message: 'Please entet valid email address' })
          }
        })
        .catch((err: any) => {
          console.log(err)
          Api.badRequest(req, res, { message: 'get failed' })
        })
    } catch (err: any) {
      console.log(err)
      Api.badRequest(req, res, { message: 'get failed' })
    }

  }

  public async getParentInfo(req: any, res: any): Promise<any> {
    const _parentinfoService = new ParentInfoService();
    await _parentinfoService
      .getParentInfo(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async viewAllParentInfo(req, res: any): Promise<any> {
    const _parentinfoService = new ParentInfoService();
    await _parentinfoService.viewAllParentInfo(req.params.id)
      .then(data => Api.ok(req, res, data))
      .catch(err => Api.badRequest(req, res, err))
  }

  public async addParentInfo(req: any, res: any): Promise<any> {
    try {
      const length = 10;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      const _parentinfoServices = new ParentInfoService();
      const existingParent = req.body.existing_parent === 'true';
      await _parentinfoServices.addParentInfo({ ...req.body, password: password })
        .then((data) => {
          AppLogger.error("addParent", data);
          this._htmlRedFile(this._filePath + '/otp.html', (err, html) => {
            if (err) {
              Api.ok(req, res, {
                message: "Mail sending failed.",
              });
              return true
            }
            const template = handlebars.compile(html);
            const replacements = {
              userId: req.body.email_address,
              tempPass: password
            };
            const htmlToSend = template(replacements);
            this._transporter.sendMail({
              from: 'admin.healthychamps@digitranit.com',
              to: req.body.email_address,
              subject: 'Healthychamps Parent login information',
              html: htmlToSend
            }, (err, info) => {
              console.log(err)
              if (info) {
                Api.ok(req, res, {
                  message: "Parent added successfully.",
                });
              }
            });
          })
        }).catch(err => Api.invalid(req, res, err))
    } catch (err) {
      Api.invalid(req, res, { message: "Parent add Failed." });
      AppLogger.error("addParentInfo", err);
    }
  }

  public async addParentInfoMobile(req: any, res: any): Promise<any> {
    try {
      const length = 10;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      const _parentinfoServices = new ParentInfoService();
      console.log('Neethu', req.body.existing_parent)
      const existingParent = req.body.existing_parent === 'true';
      await _parentinfoServices.addParentInfo({ ...req.body, password: password, existing_parent: existingParent })
        .then((data) => {
          AppLogger.error("addParent", data);
          this._htmlRedFile(this._filePath + '/otp.html', (err, html) => {
            if (err) {
              Api.ok(req, res, {
                message: "Mail sending failed.",
              });
              return true
            }
            const template = handlebars.compile(html);
            const replacements = {
              userId: req.body.email_address,
              tempPass: password
            };
            const htmlToSend = template(replacements);
            this._transporter.sendMail({
              from: 'admin.healthychamps@digitranit.com',
              to: req.body.email_address,
              subject: 'Healthychamps Parent login information',
              html: htmlToSend
            }, (err, info) => {
              console.log(err)
              if (info) {
                Api.ok(req, res, {
                  message: "Parent added successfully.",
                });
              }
            });
          })
        }).catch(err => Api.invalid(req, res, err))
    } catch (err) {
      Api.invalid(req, res, { message: "Parent added Failed." });
      AppLogger.error("addParentInfo", err);
    }
  }

  public async editParentInfo(req, res): Promise<any> {
    const _parentinfoService = new ParentInfoService();
    const getRecipeInfoList = await _parentinfoService
      .editParentInfo(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async updateParentInfo(req, res): Promise<any> {
    try {
      const parentinfoServices = new ParentInfoService();
      await parentinfoServices
        .updateParentInfo(req.body)
        .then((parentinfoList) => {
          Api.ok(req, res, {
            message: "Parent updated successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedParent", error);
      Api.invalid(req, res, {
        message: "Parent update Failed.",
      });
    }
  }
  public async deleteParentInfo(req, res): Promise<any> {
    try {
      const parentinfoServices = new ParentInfoService();
      const parent_id = req.body.parent_id.map(value => decrypted(value));
      await parentinfoServices.deleteParentInfo(parent_id);
      await ChildInfoDBModel.findAll({
        where: { parent_id: parent_id },
      }).then((children) => {
        children.forEach((child) => {
          child.status = "inactive";
          child.save();
        });
        Api.ok(req, res, {
          message: "ParentInfo and related child data deleted successfully.",
        });
      });
    } catch (error) {
      AppLogger.error("deleteParentInfo", error);
      Api.invalid(req, res, {
        message: "Failed to delete ParentInfo and related child data.",
      });
    }
  }



  public async uniqueValidation(req: any, res: any): Promise<any> {
    const _parentinfoService = new ParentInfoService();
    await _parentinfoService
      .uniqueValidation(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async downloadCSVParentInfo(req: any, res: any): Promise<any> {
    try {
      const _parentinfoService = new ParentInfoService();
      const _helper = new PostgresqlHelper();
      await _parentinfoService
        .getAllParentInfo()
        .then((data) => {
          const fields = [
            {
              label: "parent_id",
              value: (row, field) => decrypted(row[field.label]),
            },
            {
              label: "First Name",
              value: "first_name",
            },
            {
              label: "Last Name",
              value: "last_name",
            },
            {
              label: "Email Address",
              value: "email_address",
            },
            {
              label: "Country",
              value: "countries.country_name",
            },
            {
              label: "Country Code",
              value: "country_code",
            },
            {
              label: "Mobile Number",
              value: "mobile_number",
            },
            {
              label: "Centre",
              value: "centers.centre_name",
            },

          ];
          const FileDetails = {
            contentType: "text/csv",
            fileName: "parent.csv",
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

  public async getAllParentInfo(req, res): Promise<any> {
    try {
      const _parentinfoService = new ParentInfoService();
      await _parentinfoService.getAllParentInfo().then((parentName) => {
        Api.ok(req, res, parentName);
      })
    } catch (err) {
      AppLogger.error("addParentInfo", err);
      Api.invalid(req, res, { message: "ParentInfo add Failed." });
    }
  }


}
