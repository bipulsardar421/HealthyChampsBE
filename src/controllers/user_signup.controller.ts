import { Router } from "express";
import { Api, decrypted, MailCompliper, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { UserSignUpService } from "../services";
import AppLogger from "../helper/app-logger";
import { UserSignUpInterface } from "../interface";
import * as nodeMailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { FileReader } from './../lib/decorators/controllers.decorator';
import * as handlebars from 'handlebars';
import { ConfigManager } from "../config";
import * as path from "path";
import * as fs from 'fs';


export class UserSignUpController extends MailCompliper implements AppRoute {
  route = "/user_signup";
  router: Router = Router();
  userSignUpService: UserSignUpService = null;
  self = this;
  private _userSignUpService: UserSignUpService;
  _transporter = null;
  private _filePath: string = '';
  private _htmlRedFile: Function = null;
  constructor() {
    super();
    this.router.post("/getUserSignUp", this.getUserSignUp);
    this.router.get("/editUserSignUp/:id", this.editUserSignUp);
    this.router.post("/addUser", this.addUserSignUp.bind(this));
    this.router.post('/changePassword', this.changePassword.bind(this));
    this.router.put('/deleteUserSignup', this.deleteUserSignUp);
    this.router.put('/updateUserSignup', this.updateUserSignUpdetail);
    this.router.put('/updateUserSignup', this.updateUserSignUp.bind(this));
    this.router.post('/forgotpassword', this.forgotpassword.bind(this));
    this.router.put("/resendMail", this.resendMail.bind(this))
    this.router.get("/getAllUsers", this.downloadCSV);

    this._userSignUpService = new UserSignUpService();
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

  public async changePassword(req: any, res: any): Promise<any> {
    try {
      await this._userSignUpService.changePassword(req.body.password, req.body.userId)
        .then(data => {
          Api.ok(req, res, { message: 'Password updated success fully' })
        })
        .catch(err => {
          Api.badRequest(req, res, { message: 'Password update failed' })
        })
    } catch (err: any) {
      Api.badRequest(req, res, { message: 'Password update failed' })
    }

  }
  public async forgotpassword(req: any, res: any): Promise<any> {
    try {
      const length = 10;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      await this._userSignUpService.validEmail(req.body.email_address)
      .then(async (data) => {
           if(data) {
              await this._userSignUpService.forgotpassowrd(req.body.email_address, password)
              .then(data => {
                if(data) {
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
                      if (info) {
                       
                      }
                    });
                  })
                  Api.ok(req, res, {message: 'new password send your email'});
                }
              })
              .catch(err => {
                Api.badRequest(req, res, { message: 'get failed'})
              })
           } else {
            Api.badRequest(req, res, { error_code: 300, message: 'Please entet valid email address'})
           }
      })
      .catch((err: any ) => {
        Api.badRequest(req, res, { message: 'get failed'})
      })
    } catch(err: any) {
      Api.badRequest(req, res, { message: 'get failed'})
    }
   
  }

  public async getUserSignUp(req: any, res: any): Promise<any> {
    const _userSignUpService = new UserSignUpService();
    await _userSignUpService
      .getUserSignUp(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }


  public async addUserSignUp(req: any, res: any): Promise<any> {
    const sef = this;

    try {
      const length = 10;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      const _userSignUpService = new UserSignUpService();
      await _userSignUpService
        .addUserSignUp({ ...req.body, password: password })
        .then((data) => {
          AppLogger.error("addUser", data);
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
            console.log(htmlToSend)
            this._transporter.sendMail({
              from: 'admin.healthychamps@digitranit.com',
              to: req.body.email_address,
              subject: 'Healthychamps Account login information',
              html: htmlToSend
            }, (err, info) => {
              console.log(err)
              if (info) {
                Api.ok(req, res, {
                  message: "User added successfully.",
                });
              }
            });
          })



        }).catch(err => console.log(err))
    } catch (err) {
      Api.invalid(req, res, { message: "User add Failed." });
      AppLogger.error("addUserSignUp", err);
    }

  }

  public async editUserSignUp(req: any, res: any): Promise<any> {
    const _userSignUpService = new UserSignUpService();
    const getUserSignUpLiUserSignUpst = await _userSignUpService
      .editUserSignUp(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
    
  }

  public async updateUserSignUpdetail(req, res): Promise<any> {
    const usersignupservice = new UserSignUpService();
    await usersignupservice
      .updateUserSignUp(req.body)
      .then((ingredientList) => {
        Api.ok(req, res, {
          message: ingredientList,
        });
      })
      .catch((error) => {
        AppLogger.error("updatedUser", error);
        Api.invalid(req, res, {
          message: "User update Failed.",
        });
      });
  }

  public async updateUserSignUp(req, res): Promise<any> {
    try{
      const length = 10;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      const _userSignUpService = new UserSignUpService();
      await _userSignUpService
        .updateUserSignUp({...req.body,password:password})
        .then((data) => {
        AppLogger.error("resendMail", data);
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
      console.log(htmlToSend)
      this._transporter.sendMail({
        from: 'admin.healthychamps@digitranit.com',
        to: req.body.email_address,
        subject: 'Healthychamps Account login information',
        html: htmlToSend
      }, (err, info) => {
        console.log(err)
        if (info) {
          Api.ok(req, res, {
            message: "User updated successfully.",
          });
        }
      });
    })
  }).catch(err => console.log(err))
    
  } catch (err) {
    Api.invalid(req, res, { message: "User update Failed." });
    AppLogger.error("addUserSignUp", err);
  }

  }
  public async deleteUserSignUp(req, res): Promise<any> {
    const usersignupservice = new UserSignUpService();
    await usersignupservice
      .deleteUserSignUp(req.body.user_id)
      .then((ingredientList) => {
        Api.ok(req, res, {
          message: "Users deleted successfully.",
        });
      })
      .catch((error) => {
        AppLogger.error("deletedUsers", error);
        Api.invalid(req, res, {
          message: "Users deleted Failed.",
        });
      });
  }

  public async resendMail(req, res): Promise<any> {
    try{
      const length = 10;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      const _userSignUpService = new UserSignUpService();
      await _userSignUpService
        .resendMail({...req.body,password:password})
        .then((data) => {
        AppLogger.error("resendMail", data);
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
      console.log(htmlToSend)
      this._transporter.sendMail({
        from: 'admin.healthychamps@digitranit.com',
        to: req.body.email_address,
        subject: 'Healthychamps Account login information',
        html: htmlToSend
      }, (err, info) => {
        console.log(err)
        if (info) {
          Api.ok(req, res, {
            message: "Mail Sending Success.",
          });
        }
      });
    })
  }).catch(err => console.log(err))
    
  } catch (err) {
    Api.invalid(req, res, { message: "User update Failed." });
    AppLogger.error("addUserSignUp", err);
  }

}

public async downloadCSV(req: any, res: any): Promise<any> {
  try {
    const usersignupservice = new UserSignUpService();
    const _helper = new PostgresqlHelper();
    await usersignupservice
      .getAllUserInfo()
      .then((data) => {
        const fields = [
          {
            label: "user_signup_id",
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
            label: "Mobile Number",
            value: "mobile_number",
          },
          {
            label: "Time Zone",
            value: "timezone",
          },
          {
            label: "Role Name",
            value: "userroles.role_name",
          },
          {
            label: "Country",
            value: "countries.country_name",
          },
          ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Users.csv",
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

}

