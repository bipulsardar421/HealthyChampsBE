import { FilterBodyInterface, RequestBodyInterface, RequestUserSignUpInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { UserSignUpDBModel } from "../db-models/user_signup-db.model";
import { decrypted, EncriptPasswordHelper, PostgresqlHelper, sequelize } from "../helper";
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import * as crypto from 'crypto';
import * as util from 'util';
import { CountryDBModel, UserRolesDBModel } from "../db-models";

export class UserSignUpService extends EncriptPasswordHelper {
  value: string;
  self = this;
  private _scrypt = util.promisify(crypto.scrypt)
  private _salt = crypto.randomBytes(8).toString('hex');
  constructor() {
    super();
  }

  public async changePassword(password: string, userId: string): Promise<any> {
    const pass = await this.getEncrytoPassword(password);
    return await UserSignUpDBModel.update({
      password: pass,
      temp_pass: false
    }, {
      where: {
        user_signup_id: decrypted(userId)
      }
    })
  }

  public async forgotpassowrd(email_address: string, password: string): Promise<any> {
    const pass = await this.getEncrytoPassword(password);
    return await UserSignUpDBModel.update({
      password: pass,
      temp_pass: true
    }, {
      where: {
        email_address: email_address
      }
    })
  }

  public async validEmail(email_address: string): Promise<any> {
    return await UserSignUpDBModel.findOne({
      where: {
        email_address: email_address,
        status: 'active',
      }
    })
  }

  public async getUserSignUp(requestBody: Partial<RequestBodyInterface>): Promise<any> {
    try {
      let searchTxt = '';
      if (requestBody.search?.searchText && requestBody.search?.column) {
        const { searchText, column } = requestBody.search;
        if (column === "country" || column === "email_address" || column === "mobile_number" || column === "user_role") {
          requestBody.search = null;
          searchTxt = searchText;
        }
      }
  
      const searchColumn = {
        'first_name': 'first_name',
        'last_name': 'last_name',
      };
  
      const sortColumn = {
        'first_name': 'first_name',
        'last_name': 'last_name',
      };
  
      const postresSqlHelper = new PostgresqlHelper();
      const getQueryData = postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        UserSignUpDBModel,
        sortColumn
      );
  
      getQueryData.include = [
        {
          model: CountryDBModel,
        },
        {
          model: UserRolesDBModel,
        },
      ];
  
      const data = await UserSignUpDBModel.findAndCountAll(getQueryData);
  
      if (searchTxt !== '') {
        const searchFields = [
          'email_address',
          'mobile_number',
          'countries.country_name',
          'userroles.role_name',
        ];
  
        const filteredData = data.rows.filter((item) => {
          for (const field of searchFields) {
            const fieldValue = this.getFieldByPath(item, field);
            if (fieldValue && fieldValue.toLowerCase().includes(searchTxt.toLowerCase())) {
              return true; 
            }
          }
          return false;
        });
  
        data.count = filteredData.length;
        data.rows = filteredData;
      }
  
      return new CollectionResultModel(data, requestBody);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  
  public getFieldByPath(obj: any, path: string): any {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      result = result[key];
      if (!result) break;
    }
    return result;
  }
    public async addUserSignUp(
    requestBody: RequestUserSignUpInterface
  ): Promise<any> {
    const encyprPass = await this.getEncrytoPassword(requestBody.password)
    return await UserSignUpDBModel.create({
      first_name: requestBody.first_name,
      last_name: requestBody.last_name,
      email_address: requestBody.email_address,
      mobile_number: requestBody.mobile_number,
      password: encyprPass,
      temp_pass: true,
      role_id: requestBody.user_role,
      country: requestBody.country,
      //center: requestBody.center,

    });
  }

  public async editUserSignUp(id): Promise<any> {
    return await UserSignUpDBModel.findOne({
      where: {
        user_signup_id: decrypted(id),
      },
    });
  }

  public async getAllUserSignUp(): Promise<any> {
    return await UserSignUpDBModel.findAll(
      {
        include: [{
          model: CountryDBModel
        },
        {
          model: UserRolesDBModel
        }
        ],
        where: {
          status: 'active'
        }
      }
    );
  }


  public async getFilterUserSignUp(resquestBody: FilterBodyInterface): Promise<any> {
    if (resquestBody && resquestBody.user_signup_id) {
      resquestBody.user_signup_id = decrypted(resquestBody.user_signup_id)
    }
    return await UserSignUpDBModel.findAll({
      where: resquestBody
    });
  }

  public async deleteUserSignUp(requestBody: any): Promise<any> {
    const snoAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await UserSignUpDBModel.findAll({
      where: { user_signup_id: snoAry }
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'User is deleted successfully.'
    }).catch(err => {
      return 'User is not Delete.!'
    });

  }
  public async updateUserSignUpdetail(requestBody: any): Promise<any> {
    const user_signup_id = parseInt(decrypted(requestBody.user_signup_id));
    return await UserSignUpDBModel.findOne({
      where: { user_signup_id: user_signup_id }
    }).then(UserList => {
      UserList.first_name = requestBody.first_name,
        UserList.last_name = requestBody.last_name,
        UserList.mobile_number = requestBody.mobile_number,
        UserList.password = requestBody.password,
        UserList.role_id = requestBody.user_role,
        UserList.country = requestBody.country,
        UserList.status = 'active';
      UserList.save();
      return 'User is Updated successfully.'
    }).catch(error => {
      return 'User Updated failed.!'
    });

  }
  public async updateUserSignUp(requestBody: any): Promise<any> {
    const user_signup_id = parseInt(decrypted(requestBody.user_signup_id));
    const encyprPass = await this.getEncrytoPassword(requestBody.password)
    return await UserSignUpDBModel.findOne({
      where: { user_signup_id: user_signup_id }
    }).then(UserList => {
      UserList.first_name = requestBody.first_name,
        UserList.last_name = requestBody.last_name,
        UserList.email_address = requestBody.email_address,
        UserList.mobile_number = requestBody.mobile_number,
        UserList.password = encyprPass,
        UserList.temp_pass = true,
        UserList.role_id = requestBody.user_role,
        UserList.country = requestBody.country,
        //UserList.center = requestBody.center,
        UserList.status = 'active';
      UserList.save();
      return 'User is Updated successfully.'
    }).catch(error => {
      return 'User Updated failed.!'
    });

  }
  public async resendMail(requestBody: any): Promise<any> {
    const user_signup_id = parseInt(decrypted(requestBody.user_signup_id));
    const encyprPass = await this.getEncrytoPassword(requestBody.password)
    return await UserSignUpDBModel.findOne({
      where: { user_signup_id: user_signup_id }
    }).then(UserList => {
      UserList.password = encyprPass,
        UserList.status = 'active';
      UserList.save();
      return 'User is Updated successfully.'
    }).catch(error => {
      return 'User Updated failed.!'
    });

  }


  public async getAllUserInfo(): Promise<any> {
    return await UserSignUpDBModel.findAll(
      {
        include: [
          {
            model: CountryDBModel,
          },
          {
            model: UserRolesDBModel,
          },
        ],
        where: {
          status: 'active'
        },
      }
    );
  }
}