import * as path from "path";
import * as fs from "fs";
import { ConfigInterface, ConfigManager } from "./config";

export class SwaggerApi {
  private config: ConfigInterface;

  constructor() {
    this.config = new ConfigManager().config;
  }

  getSwaggerOption() {
    let urlss = '';
    if(this.config.NODE_ENV === 'development') {
      urlss = `http://${this.config.baseUrl}:${this.config.port}`;
    } else {
      urlss = `${this.config.baseUrl}`;
    }
    console.log(urlss, this.config.NODE_ENV)
    const url = `${urlss}/api-testing/v1/`;
    const directoryPath = path.join(__dirname, "swagger-docs");
    const readFiles = fs.readdirSync(directoryPath);
    const urls = [];
    readFiles.forEach((fileName) => {
      urls.push({
        url: `${url}${fileName}`,
        name: /(\S+).swagger.json/g.exec(fileName)[1].toLocaleUpperCase(),
      });
    });
    const options = {
      explorer: true,
      swaggerOptions: {
        urls: urls,
      },
    };

    return options;
  }
}
