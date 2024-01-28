
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { decrypted, encrypted, PostgresqlHelper, sequelize } from "../helper";
import { CollectionResultModel } from "../model";
import { HelpandSupportDBModel, HelpEditDBModel, HelpFAQDBModel } from "../db-models";
import { HelpandSupportInterface, HelpFAQInterface, RequestBodyInterface } from "../interface";
import { required } from "nconf";
import { FAQModel } from "../model/Faq.model";


export class HelpandSupportService {
  value: string;
  self = this;
  constructor() {
  }


  public async gethelpandsupport(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {
      'country_code': 'country_code',
      'phone_number': 'phone_number',
      'email_address': 'email_address'
    };
    const postresSqlHelper = new PostgresqlHelper();
    const sortColunm = {
      'country_code': 'country_code',
      'phone_number': 'phone_number',
      'email_address': 'email_address'
    }

    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      HelpandSupportDBModel,
      sortColunm)

    return await HelpandSupportDBModel.findAndCountAll(
      getQueryData
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }



  public async addhelpandsupport(sub: HelpandSupportInterface): Promise<any> {
    return await HelpandSupportDBModel.create({
      country_code: sub.country_code,
      phone_number: sub.phone_number,
      email_address: sub.email_address,
    });
  }

  public async editHelpandSupport(id): Promise<any> {
    return await HelpEditDBModel.findOne({
      where: {
        help_support_id: decrypted(id),
      },
    });
  }

  public async updateHelpandSupport(requestBody: any): Promise<any> {
    const help_support_id = parseInt(decrypted(requestBody.help_support_id));
    return await HelpandSupportDBModel.findOne({
      where: { help_support_id: help_support_id }
    }).then(helpList => {
      helpList.country_code = requestBody.selectedCountryCode;
      helpList.phone_number = requestBody.mobile_number;
      helpList.email_address = requestBody.email_address,
        helpList.status = 'active';
      helpList.save();
      return 'Help Updated successfully.'
    }).catch(error => {
      return 'Help Updated failed.!'
    });
  }

  public async deletehelpandsupport(requestBody: any): Promise<any> {
    const helpAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await HelpandSupportDBModel.findAll({
      where: { help_support_id: helpAry }
    }).then((des) => {
      des.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Help and Support deleted successfully.'
    }).catch(err => {
      return 'Help and Support is not Deleted.!'
    });
  }

  public async getAllHelpandSupport(): Promise<HelpandSupportInterface[]> {
    return await HelpandSupportDBModel.findAll({
      attributes: ['help_support_id', 'country_code', 'phone_number', 'email_address'],
      where: {
        status: 'active'
      }
    })
  }


  public async getFAQ(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = [
      "faq_title",
      "faq_description"
    ];
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      HelpFAQDBModel)

    return await HelpFAQDBModel.findAndCountAll(
      getQueryData
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async addFAQ(faq: HelpFAQInterface): Promise<any> {
    return await HelpFAQDBModel.create({
      faq_title: faq.faq_title,
      faq_description: faq.faq_description,
    })
  }

  public async editFAQ(id): Promise<any> {
    return await HelpFAQDBModel.findOne({
      where: {
        faq_id: decrypted(id),
      },
    });
  }



  public async deleteFAQ(requestBody: any): Promise<any> {
    const faqAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await HelpFAQDBModel.findAll({
      where: { faq_id: faqAry }
    }).then((des) => {
      des.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'FAQ deleted successfully.'
    }).catch(err => {
      return 'FAQ is not Deleted.!'
    });
  }
  public async updateFAQ(requestBody: any): Promise<any> {
    await HelpFAQDBModel.update({
      faq_title: requestBody.faq_title,
      faq_description: requestBody.faq_description
    },
      {
        where: { faq_id: parseInt(decrypted(requestBody.faq_id)) },
      }
    )
  }

}
