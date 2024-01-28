import { ChildInfoInterface, FilterBodyInterface, ParentInfoInterface, RequestBodyInterface, RequestParentInfoInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { ParentInfoDBModel } from "../db-models/parent-info-db.model";
import { decrypted, PostgresqlHelper, EncriptPasswordHelper, sequelize } from "../helper";
import { Op, Sequelize, where } from "sequelize";
import AppLogger from "../helper/app-logger";
import { AllergenDBModel, CentreDBModel, ChildAllergenDBModel, ChildDietaryDBModel, ChildInfoDBModel, ChildPreferenceDBModel, CountryDBModel, DietaryDBModel, NutritionCategoryDBModel, ParentProfileImageDBModel } from "../db-models";


export class ParentInfoService extends EncriptPasswordHelper {
  value: string;
  self = this;
  childInfoService: any;

  constructor() {
    super();
  }

  public async getParentInfo(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    let searchTxt = '';
    if (requestBody.search?.searchText && requestBody.search?.column) {
      const { searchText, column } = requestBody.search;
      if (column === "country" || column === "centre") {
        requestBody.search = null;
        searchTxt = searchText;
      }
    }

    const searchColumn = {
      'first_name': 'first_name',
      'last_name': 'last_name',
      'email_address': 'email_address',
      'mobile_number': 'mobile_number',
    };

    const sortColumn = {
      'first_name': 'first_name',
      'last_name': 'last_name',
      'email_address': 'email_address',
      'mobile_number': 'mobile_number',
    };

    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      ParentInfoDBModel,
      sortColumn
    );

    getQueryData.include = [
      {
        model: CountryDBModel,
      },
      {
        model: CentreDBModel,
      },
      {
        model: ParentProfileImageDBModel,
      }
    ];

    return await ParentInfoDBModel.findAndCountAll(getQueryData)
      .then((data) => {
        if (searchTxt !== '') {
          const filteredData = data.rows.filter((item) => {
            const searchFields = [
              'countries.country_name',
              'centers.centre_name',
            ];

            const fieldValue = this.getFieldByPath(item, searchFields[0]);
            return fieldValue && fieldValue.toLowerCase().includes(searchTxt.toLowerCase());
          });

          data.count = filteredData.length;
          data.rows = filteredData;
        }
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
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

  public async addParentInfo(parent: RequestParentInfoInterface): Promise<any> {
    const temp_pass = parent.login_orgin === 'facebook' || parent.login_orgin === 'google' ? false : true;
    const encyprPass = parent.password ? await this.getEncrytoPassword(parent.password) : '123';
    const existing_parent = parent.login_orgin === 'healthychamps' && parent.existing_parent === true;

    const parentData: any = {
      first_name: parent.first_name,
      last_name: parent.last_name,
      email_address: parent.email_address,
      country: parent.country,
      country_code: parent.country_code,
      mobile_number: parent.mobile_number,
      password: encyprPass,
      login_orgin: parent.login_orgin,
      temp_pass: temp_pass,
      existing_parent: existing_parent,
    };

    if (parent.centre) {
      parentData.centre = parent.centre;
    }

    return await ParentInfoDBModel.create(parentData);
  }



  public async editParentInfo(id): Promise<any> {
    return await ParentInfoDBModel.findOne({
      where: {
        parent_id: decrypted(id),
      },
    });
  }


  public async updateParentInfo(requestBody: any): Promise<any> {
    try {
      const parent_id = parseInt(decrypted(requestBody.parent_id));
      return await ParentInfoDBModel.findOne({
        where: { parent_id: parent_id }
      }).then(parentList => {
        parentList.first_name = requestBody.first_name;
        parentList.last_name = requestBody.last_name;
        parentList.email_address = requestBody.email_address,
          parentList.country = requestBody.country;
        parentList.country_code = requestBody.country_code,
          parentList.mobile_number = requestBody.mobile_number,
          parentList.centre = requestBody.centre,
          parentList.password = requestBody.password,
          parentList.existing_parent = requestBody.existing_parent,
          parentList.status = 'active';
        parentList.save();
        return 'ParentInfo Updated successfully.'
      }).catch(error => {
        return 'ParentInfo Updated failed.!'
      });
    } catch (err) {
      console.error(err);

    }

  }

  public async getExistingParent(emailId: string, centreId: number): Promise<any> {
    const existingParent = await ParentInfoDBModel.findOne({
      where: {
        email_address: emailId,
        centre: centreId,
      },
      include: [
        {
          model: CentreDBModel
        }
      ]
    });

    return existingParent;
  }
  public async viewAllParentInfo(id?: string): Promise<any> {
    return await ParentInfoDBModel.findOne({
      include: [
        {
          model: CountryDBModel
        },
        {
          model: CentreDBModel
        },
        {
          model: ParentProfileImageDBModel
        }
      ], where: {
        parent_id: parseInt(decrypted(id)),
      },
    });
  }


  public async deleteParentInfo(parentIds: number[]): Promise<any> {
    const t = await sequelize.getSequelize.transaction();
    try {
      await ChildAllergenDBModel.destroy({
        where: { child_info_id: parentIds },
        transaction: t,
      });

      await ChildDietaryDBModel.destroy({
        where: { child_info_id: parentIds },
        transaction: t,
      });

      await ChildPreferenceDBModel.destroy({
        where: { child_info_id: parentIds },
        transaction: t,
      });

      await ParentInfoDBModel.update(
        { status: 'inactive' },
        { where: { parent_id: parentIds }, transaction: t }
      );

      await t.commit();
      return { message: 'ParentInfo and related child information deleted successfully.' };
    } catch (error) {
      await t.rollback();
      AppLogger.error('deleteParentInfo', error);
      throw new Error('ParentInfo and related child information deletion failed.');
    }
  }

  public async getAllParentInfo(): Promise<ParentInfoInterface[]> {
    return await ParentInfoDBModel.findAll(
      {
        include: [{
          model: CountryDBModel
        },
        {
          model: CentreDBModel
        },
        ],
        where: {
          status: 'active'
        },
      });
  }

  public async uniqueValidation(requestBody: any): Promise<any> {
    return await ParentInfoDBModel.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('email_address')),
          Sequelize.fn('lower', requestBody.email_address)
        ),
        status: 'active',
        parent_id: { [Op.ne]: requestBody.parent_id }

      }
    })
  }

  public async uniqueValidationEamil(requestBody: any): Promise<any> {
    return await ParentInfoDBModel.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('email_address')),
          Sequelize.fn('lower', requestBody.email_address)
        ),
        status: 'active',
      }
    })
  }

  public async getParent(email_address): Promise<any> {
    return await ParentInfoDBModel.findOne({
      where: {
        email_address: email_address,
      },
      include: [{
        model: ChildInfoDBModel,
        include: [
          {
            model: ChildDietaryDBModel,
            include: [{
              model: DietaryDBModel
            }]
          },
          {
            model: ChildAllergenDBModel,
            include: [{
              model: AllergenDBModel
            }]
          },
          {
            model: ChildPreferenceDBModel,
            include: [{
              model: NutritionCategoryDBModel
            }]
          }
        ]
      }]
    });
  }

  public async changePassword(password: string, parentId: string): Promise<any> {
    const pass = await this.getEncrytoPassword(password);
    return await ParentInfoDBModel.update({
      password: pass,
      temp_pass: false
    }, {
      where: {
        parent_id: decrypted(parentId)
      }
    })
  }

  public async forgotpassowrd(email_address: string, password: string): Promise<any> {
    const pass = await this.getEncrytoPassword(password);
    return await ParentInfoDBModel.update({
      password: pass,
      temp_pass: true
    }, {
      where: {
        email_address: email_address
      }
    })
  }

  public async validEmail(email_addrss: string): Promise<any> {
    return await ParentInfoDBModel.findOne({
      where: {
        email_address: email_addrss,
        status: 'active',
        login_orgin: 'healthychamps'
      }
    })
  }


  public async uploadImages(
    imageName: string,
    imageType: string,
    parentIds: string,
    typeQuery: string,
    imageId: string
  ): Promise<any> {
    const imageTypes = {
      profileImg: 'profile_image',
    };

    const payLoad = {};
    payLoad['parent_id'] = decrypted(parentIds);
    payLoad[imageTypes[imageType]] = imageName;
    const decryptedImageId = decrypted(imageId);

    if (typeQuery === 'create') {
      console.log('create');

      return await ParentProfileImageDBModel.create(payLoad);
    } else {
      try {
        console.log('update');

        return await ParentProfileImageDBModel.update(payLoad, {
          where: {
            parent_image_id: imageId
          }
        });
      } catch (err) {
        console.error(err);
        throw err; 
      }
    }
  }
  public async deleteImg(imgName: string): Promise<any> {
    try {
      const imageToDelete = await ParentProfileImageDBModel.findOne({
        where: { profile_image: imgName }
      });
  
      if (imageToDelete) {
        await ParentProfileImageDBModel.destroy({
          where: { profile_image: imgName }
        });
        return { success: true, message: 'Image deleted successfully' };
      } else {
        return { success: false, message: 'Image not found' };
      }
    } catch(error) {
      console.error('Error deleting image:', error);
      throw new Error('An error occurred while deleting the image');
    }
}

}
