import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as http from "http";
import AppLogger from "./helper/app-logger";
import { Api } from "./helper/api";
import { ConfigInterface, ConfigManager } from "./config";
import { AppRouting } from "./app.routing";
import path = require("path");
import swaggerJsDoc = require("swagger-jsdoc");
import swaggerUI = require("swagger-ui-express");
import cors = require("cors");
import { SwaggerApi } from "./swaggerApi";
import { expressjwt } from 'express-jwt';

export class ExpressApi {
  public app: express.Express;
  private router: express.Router;
  private config: ConfigInterface;
  constructor() {
    this.config = new ConfigManager().config;
    this.app = express();
    this.router = express.Router();
    this.configure();
    // const key1 = crypt.randomBytes(32).toString('hex');
    // const key2 = crypt.randomBytes(32).toString('hex');
    // console.table({key1, key2})
  }


  private configure() {
    this.configureMiddleware();
    this.configureBaseRoute();
    this.configureRoutes();
    this.verifyToken();
    this.errorHandler();
  }

  private configureMiddleware() {
    console.log(this.config.NODE_ENV)
    const recipeImg = this.config.NODE_ENV === 'production' ? 'src/upload/recipe/images' :
      'upload/recipe/images'
    const recipeVid = this.config.NODE_ENV === 'production' ? 'src/upload/recipe/videos' :
      'upload/recipe/videos'
    const podcastsImg = this.config.NODE_ENV === 'production' ? 'src/upload/podcasts/images' :
      'upload/podcasts/images'
    const podcastsVid = this.config.NODE_ENV === 'production' ? 'src/upload/podcasts/videos' :
      'upload/podcasts/videos'
    const podcastsAudio = this.config.NODE_ENV === 'production' ? 'src/upload/podcasts/audio' :
      'upload/podcasts/audio'
    const blogsImg = this.config.NODE_ENV === 'production' ? 'src/upload/blogs/images' :
      'upload/blogs/images'
    const workshopImg = this.config.NODE_ENV === 'production' ? 'src/upload/workshop/images' :
      'upload/workshop/images'
    const workshopVid = this.config.NODE_ENV === 'production' ? 'src/upload/workshop/videos' :
      'upload/workshop/videos'
    const mealPlanLogo = this.config.NODE_ENV === 'production' ? 'src/upload/mealplan/images' :
      'upload/mealplan/images'
    const parentProfileImg = this.config.NODE_ENV === 'production' ? 'src/upload/parent/images' :
    'upload/parent/images'
    const courseImg = this.config.NODE_ENV === 'production' ? 'src/upload/course/images':
    'upload/course/images'
    const courseVid = this.config.NODE_ENV === 'production' ? 'src/upload/course/videos':
    'upload/course/videos'
    const firebaseInit = this.config.NODE_ENV === 'production' ? 'src/assets_firebase' :
    'assets_firebase'
    const assets = this.config.NODE_ENV === 'production' ? 'src/assets/images' :
    'assets'


    this.app.use(json({ limit: "50mb" }));
    this.app.use(cors({
      origin: '*'
    }));
    this.app.use(compression());
    this.app.use(
      "/api-testing/v1",
      express.static(path.join(__dirname, "swagger-docs"))
    );
    this.app.use(
      "/api-image/recipe",
      express.static(path.join(__dirname, recipeImg)),
    );
    this.app.use(
      "/api-video/recipe",
      express.static(path.join(__dirname, recipeVid)),
    );
    this.app.use(
      "/api-image/podcasts",
      express.static(path.join(__dirname, podcastsImg)),
    );
    this.app.use(
      "/api-video/podcasts",
      express.static(path.join(__dirname, podcastsVid)),
    );
    this.app.use(
      "/api-audio/podcasts",
      express.static(path.join(__dirname, podcastsAudio)),
    );
    this.app.use(
      "/api-image/blogs",
      express.static(path.join(__dirname, blogsImg)),
    );
    this.app.use(
      "/api-image/workshop",
      express.static(path.join(__dirname, workshopImg)),
    );
    this.app.use(
      "/api-video/workshop",
      express.static(path.join(__dirname, workshopVid)),
    );
    this.app.use(
      "/api-image/mealplan",
      express.static(path.join(__dirname, mealPlanLogo)),
    );
    this.app.use(
      "/api-image/parent",
      express.static(path.join(__dirname, parentProfileImg)),
    );
    this.app.use(
      "/api-image/course",
      express.static(path.join(__dirname, courseImg)),
    );
    this.app.use(
      "/api-video/course",
      express.static(path.join(__dirname, courseVid)),
    );
    this.app.use(
      "/api-firebaseInit/firebaseAdmin",
      express.static(path.join(__dirname, firebaseInit)),
    );
    this.app.use(
      "/api-image/assets",
      express.static(path.join(__dirname, assets)),
    );
    this.app.use(urlencoded({ limit: "50mb", extended: true }));
    this.app.use(
      "/swagger-docs",
      swaggerUI.serve,
      swaggerUI.setup(null, new SwaggerApi().getSwaggerOption())
    );
    AppLogger.configureLogger();
  }

  private configureBaseRoute() {
    this.app.use((request, res, next) => {
      if (request.url === "/") {
        return Api.ok(request, res, new ConfigManager().config.info);
      } else {
        next();
      }
    });
    this.app.use(this.config.basePath, this.router);
    new AppRouting(this.router);
  }

  private configureRoutes() {
    this.app.use((request: Request, res: Response, next: NextFunction) => {
      for (const key in request.query) {
        if (key) {
          // eslint-disable-next-line security/detect-object-injection
          request.query[key.toLowerCase()] = request.query[key];
        }
      }
      next();
    });
  }


  private verifyToken() {
    // const authHeader = req.headers["authorization"];
    //       const token = authHeader && authHeader.split(" ")[1];
    this.app.use(
      expressjwt({
        secret: '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb',
        algorithms: ['HS256']
      }).unless({
        path: ['/api/v1/login/valid',
          '/api/v1/parent_info/addParentInfoMobile',
          '/api/v1/parent_info/forgotpass',
          '/api/v1/user_signup/forgotpassword',
          '/api/v1/login/socialMediaLogin',
          '/api/v1/login/parentLogin',
          '/api/v1/login/refresToken',
          '/api/v1/country/get-Allcountry',
          '/api/v1//termsandconditions/getTermsAndConditions',
        ]
      })
    );

    this.app.use(
      (
        error: ErrorRequestHandler,
        request: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction
      ) => {
        if (error && error.name === "UnauthorizedError") {
          console.log(error.name)
          Api.unauthorized(request, res, { message: 'UnauthorizedError' })
        }

      }
    );
  }

  //   public verifyToken() {
  //     this.app.use((
  //       req: any,
  //       res: Response,
  //       next: NextFunction
  //     ) => {
  //       const authHeader = req.headers["authorization"];
  //       const token = authHeader && authHeader.split(" ")[1];
  //       console.log(authHeader)
  //       if (token) {
  //         jwt.verify(token, '123f7f103ea5bf1ad9e4448ee501f2e321e17c9ff5b119a9c78d3b7f0c7e4eeb', async (err: any, decoded: any) => {
  //           if (err) req.user = undefined;
  //           if(decoded && decoded.id === 'sysadmin') {
  //             req.user = SYSTEM_ADMIN;
  //             next()
  //           } if(decoded && decoded.isMobile) {
  //             await ParentInfoDBModel.findOne({
  //               where: {
  //                 email_address: decoded.id
  //               }
  //             }).then(data => {
  //               req.user = data.dataValues;
  //               next()
  //             }).catch(err => {
  //               Api.forbidden(req, res)
  //             })
  //           } else if(decoded && decoded.id){
  //             await UserSignUpDBModel.findOne({
  //               where: {
  //                 email_address: decoded.id
  //               }
  //             }).then(data => {
  //               req.user = data.dataValues;
  //               next()
  //             }).catch(err => {
  //               Api.forbidden(req, res)
  //             })
  //           } else {
  //             req.user = undefined;
  //             next()
  //           }
  //         });
  //       } else {
  //         req.user = undefined;
  //         next()
  //       }
  //     }
  //   )
  //  }

  private errorHandler() {
    this.app.use(
      (
        error: ErrorRequestHandler,
        request: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction
      ) => {
        if (error && error.name === "UnauthorizedError") {
          console.log(error.name)
          Api.unauthorized(request, res, { message: 'UnauthorizedError' })
        }
        if (request.body) {
          AppLogger.error("Payload", JSON.stringify(request.body));
        }
        AppLogger.error("Error", error);
        Api.serverError(request, res, error);
      }
    );

    // catch 404 and forward to error handler
    this.app.use((request, res) => {
      Api.notFound(request, res);
    });
  }

  public run() {
    const port = this.config.port;

    // const server = https.createServer({
    //   key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    //   cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    // },this.app);
    // server.listen(port);
    const server = http.createServer(this.app);
    server.listen(port);


    AppLogger.info(this.config.NODE_ENV, "Listen port at " + port);
    server.on("error", this.onError);
  }

  private onError(error) {
    const port = error.port;
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}
