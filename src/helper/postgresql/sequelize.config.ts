import path = require("path");
import { Sequelize } from "sequelize-typescript";
import * as DBModels from "../../db-models";

import { ConfigManager, ConfigInterface } from "../../config";

import * as pg from 'pg';

export class SequelizeConfig {
  private sequelize: Sequelize;
    model: any;
    models: any;

  public get getSequelize(): Sequelize {
    return this.sequelize;
  }
  public setConnection(): void {
    const config: ConfigInterface = new ConfigManager().config;
    const databaseInfo = config.databases.default;
    const options = databaseInfo.options;
pg.defaults.parseInt8 = true;
    //options['repositoryMode'] = true;
    options.logging = console.log;
    this.sequelize = new Sequelize(
      databaseInfo.options.database,
      databaseInfo.user,
      databaseInfo.password,
      options,     
    );
    
    this.sequelize.addModels(Object.values(DBModels));
    this.sequelize.repositoryMode = true
  }



  public async authenticate(): Promise<void> {
    return this.sequelize.authenticate();
  }
}

export const sequelize = new SequelizeConfig();
