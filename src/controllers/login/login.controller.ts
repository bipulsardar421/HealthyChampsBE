import { Router } from "express";
import { AppRoute } from "../../app-route";
import { LoginService, ParentInfoService } from "../../services";
import { Api, EncriptPasswordHelper } from "../../helper";
import AppLogger from "../../helper/app-logger";
import * as jwt from 'jsonwebtoken'
import { SYSTEM_ADMIN } from "../../const";

export class LoginController extends EncriptPasswordHelper implements AppRoute {

  private _loginService: LoginService;
  public route = "/login";
  public router: Router = Router();
  private readonly SYSTEM_LOGIN = SYSTEM_ADMIN;
  private _parentinfoService: ParentInfoService = null;
  constructor() {
    super();
    this._loginService = new LoginService();
    this._parentinfoService = new ParentInfoService();

    this.router.post("/valid", this.validLogin.bind(this));
    this.router.post("/refresToken", this.refreshToken.bind(this));
    this.router.put("/logout", this.logout.bind(this));
    this.router.get("/permission", this.getPermission.bind(this));
    this.router.post("/parentLogin", this.mobileLogin.bind(this));
    this.router.post("/socialMediaLogin", this.socialMediaLogin.bind(this));
    this.router.post("/mobileChangePass", this.parentChangePass.bind(this));
  }

  public async mobileLogin(req, res): Promise<any> {
    console.log('called');
    
    try {
      await this._loginService.mobileLoginValidation(req.body)
        .then(async parentInfo => {
          if (parentInfo) {
            const getPassword = await this._loginService.mobileLoginPassValidation(parentInfo.dataValues.email_address);
            console.log(req.body.password, getPassword.dataValues.password)
            const validPassword = await this.validationPassword(req.body.password, getPassword.dataValues.password);
            if (validPassword) {
              var token = jwt.sign({ id: parentInfo.dataValues.email_address, isMobile: true },
                '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb', {
                expiresIn: '30s' // expires in 24 hours
              });
              var refreshToken = jwt.sign({ id: parentInfo.dataValues.email_address, isMobile: true },
                '9d01f960f67da1dc327b5b0ac697c2f057efe08d6d115ed01b3667587fdc4ee6', {
                expiresIn: '1y' // expires in 24 hours
              });
              if (token) {

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Expose-Headers', 'X-Token');

                res.setHeader('X-Token', token);
                // return next()
              }
              Api.ok(req, res, parentInfo)
            } else {
              Api.badRequest(req, res, { message: "Incorrect password", errorCode: '513' })
            }
          } else {
            Api.badRequest(req, res, { message: "Incorrect username", errorCode: '512' })
          }
        })
    } catch (err) {
      Api.badRequest(req, res, { message: "Incorrect username and password", errorCode: '511' })
    }
  }

  public async validLogin(req: any, res: any, next): Promise<any> {
    try {
      if (req.body.username === 'sysadmin' && req.body.password === 'incorrect01!') {
        var token = jwt.sign({ id: 'sysadmin'},
          '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb', {
            expiresIn: '30s'
        });
        var refreshToken = jwt.sign({ id: req.body.username },
          '9d01f960f67da1dc327b5b0ac697c2f057efe08d6d115ed01b3667587fdc4ee6', {
          expiresIn: '1y' // expires in 24 hours
        });
        if (token) {

          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Expose-Headers', 'X-Token, X-Token-Refresh');
          // res.setHeader('Access-Control-Expose-Headers', 'X-Token-Refresh');

          res.setHeader('X-Token', token);
          res.setHeader('X-Token-Refresh', refreshToken);
          // return next()
        }
        Api.ok(req, res, this.SYSTEM_LOGIN)
      } else {
        await this._loginService.validLogin(req.body).then(async data => {
          if (data) {

            const getPassword = await this._loginService.getpassword(data.dataValues.email_address);

            const validPassword = await this.validationPassword(req.body.password, getPassword.dataValues.password);

            if (validPassword) {
              var token = jwt.sign({ id: data.dataValues.email_address },
                '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb', {
                expiresIn: '30s' // expires in 24 hours
              });
              var refreshToken = jwt.sign({ id: req.body.username },
                '9d01f960f67da1dc327b5b0ac697c2f057efe08d6d115ed01b3667587fdc4ee6', {
                expiresIn: '1y' // expires in 24 hours
              });
              if (token) {

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Expose-Headers', 'X-Token,X-Token-Refresh');
               // res.setHeader('Access-Control-Expose-Headers', 'X-Token-Refresh');

                res.setHeader('X-Token', token);
                res.setHeader('X-Token-Refresh', refreshToken);
                // return next()
              }
              Api.ok(req, res, data)
            } else {
              Api.badRequest(req, res, { message: "Incorrect Password", errorCode: '512' })
            }

          } else {
            Api.badRequest(req, res, { message: "Incorrect UserId", errorCode: '513' })
          }
        }).catch(err => {
          console.log(err)
          AppLogger.error('LoginService: ', err)
          Api.badRequest(req, res, { message: "Incorrect UserId or Password", errorCode: '511' })
        })
      }
    } catch (error) {
      console.log(error)
      Api.badRequest(req, res, { message: "Authentication Failed" })
    }

  }


  public async getPermission(req, res): Promise<void> {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb', async (err: any, decoded: any) => {
        if (err) {
          Api.unauthorized(req, res, {message: 'UnauthorizedError'})
        }
        if ( decoded && decoded.id === 'sysadmin') {
          Api.ok(req, res, this.SYSTEM_LOGIN);
        } else if(decoded) {
          const data = await this._loginService.validLogin({ 'username': decoded?.id, 'password': '' });
          Api.ok(req, res, data);
        }

      });
    } else {
      Api.unauthorized(req, res, {message: 'UnauthorizedError'})
    }
  }


  public async refreshToken(req, res): Promise<void> {
    try {
      const { token } = req.body;
      console.log(token)
      jwt.verify(token, '9d01f960f67da1dc327b5b0ac697c2f057efe08d6d115ed01b3667587fdc4ee6', (err: any, decode: any) => {
        if (decode) {
          var token = jwt.sign({ id: decode.id },
            '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb', {
              expiresIn: '30s' // expires in 24 hours
          });
          res.setHeader('Access-Control-Expose-Headers', 'X-Token');
          res.setHeader('X-Token', token);
          Api.ok(req, res, { token: token })
        }
      });

    } catch {
      Api.badRequest(req, res, { message: 'accessToken getting failed' })
    }
  }

  public async logout(req, res): Promise<void> {
    {
      const authHeader = req.headers["authorization"];
      jwt.sign(authHeader, '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb',
        { expiresIn: 1 },
        (logout, err) => {
          if (logout) {
            res.send({ msg: 'You have been Logged Out' });
          }
          else {
            res.send({ msg: 'Error' });
          }
        }
      );
    }
  }

  public async socialMediaLogin(req, res): Promise<void> {
    const checkParent = await this._parentinfoService.uniqueValidationEamil({ email_address: req.body.email_address });
    console.log(checkParent, !checkParent)
    if (!checkParent) {
      await this._parentinfoService.addParentInfo(req.body);
    }
    await this._parentinfoService.getParent(req.body.email_address).then(data => {
      if (data) {
        var token = jwt.sign({ id: data.dataValues.email_address },
          '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb', {
          expiresIn: 86400 // expires in 24 hours
        });
        if (token) {

          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Expose-Headers', 'X-Token');

          res.setHeader('X-Token', token);
          // return next()
        }
        Api.ok(req, res, data)
      } else {
        Api.badRequest(req, res, { message: 'Authication is failed' });
      }
    })
  }

  public async parentChangePass(req, res): Promise<void> {
    try {
      const changePasseord = await this._parentinfoService.changePassword(
        req.body.confirmPassword,
        req.body.parent_id
      );
      if (changePasseord) {
        Api.ok(req, res, { message: 'password chanage success' })
      } else {
        Api.badRequest(req, res, { message: 'password chanage Failed' })
      }
    } catch (error) {
      console.log(error)
      Api.badRequest(req, res, error)
    }
  }
}