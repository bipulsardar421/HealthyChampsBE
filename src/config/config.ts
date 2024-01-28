export interface ConfigInterface {
  port: number;
  NODE_ENV: string;
  info: any;
  basePath: string;
  baseUrl: string;
  databases: SequelizeDBDefaultInterface;
}

export interface DatabasesInterface {
  host: string;
  database: string;
  requestTimeout: number;
  dialect: any;
  logging: any;
  dialectOptions?: dialectOptionsInterface;
  repositoryMode: true,
}

export interface SequelizeDBOptionsInterface {
  user: string;
  password: string;
  options: DatabasesInterface;
}

export interface dialectOptionsInterface {
  encrypt: boolean;
  supportBigNumbers: boolean;
}

export interface SequelizeDBDefaultInterface {
  default: SequelizeDBOptionsInterface;
}
