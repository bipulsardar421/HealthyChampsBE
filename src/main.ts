import { ExpressApi } from "./express.api";
import { Api, sequelize } from "./helper";
import AppLogger from "./helper/app-logger";
import * as DBModels from "./db-models";
const api = new ExpressApi();

api.run();
sequelize.setConnection();
sequelize.authenticate().then(data => {
   console.log('DB connected successfully...')
}).catch(error => {
    console.warn('Database connection was failed.. Please check the connection', error)
})
const app = api.app;

AppLogger.info('info','welcome 1')

export { app };
