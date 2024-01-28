import {
  Router,
  Request,
  Response,
  NextFunction,
  IRouter,
  response,
} from "express";
import * as fs from 'fs';
import { request } from "http";
import { AppRoute } from "../../app-route";
import { ConfigManager } from "../../config";
import * as path from "path";

export const ROUTING: string[] = [];
export enum REQUEST {
  GET = "get",
  POST = "post",
}
const router: IRouter = Router();
export function Controller(constructor: Function): Function {
  constructor.prototype.route = constructor.name.toString();
  constructor.prototype.router = router;
  const name = constructor.name.toLowerCase();
  ROUTING.push(name);
  return function () {
  };
}

export function IncludeTimeStampsDecorator<T extends { new(): {} }>(ctr: T) {
  return class implements AppRoute {
    created_at: string = new Date().toISOString();
    updated_at: string = new Date().toISOString();
    constructor() {
      // super(...args);
    }
    route: string;
    router: Router;
  };
}

export function initFunction(url: string, method: REQUEST): Function {
  router[method](url);
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    return router[method](url, descriptor.value);
  };
}

export function AutoCall() {
  return function <T extends { new(...args: any[]): any }>(constructor: T) {
    return (
      class extends constructor implements AppRoute {
        name = constructor.name.toLowerCase();
        route: string = this.name;
        router: Router = router;
        constructor(...args: any[]) {
          super(...args);
        }
      } && this.call(this)
    );
  };
}


export function FileReader(constructor: Function) {
  let config = new ConfigManager().config;
  const folderName = config.NODE_ENV === 'production' ? 'src/upload/mail_content' : 'upload/mail_content';
  constructor.prototype.filePath = path.join(__dirname, folderName)
  constructor.prototype.readHTMLFile = function(path: string, callback: Function) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
           callback(err);                 
        }
        else {
            callback(null, html);
        }
    });
};

}