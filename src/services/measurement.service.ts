
import { PostgresqlHelper, decrypted, sequelize } from "../helper";
import { MeasurementDBModel } from "../db-models/measurement-db.model";
import { MeasurementCountryInterface, MeasurementInterface, RequestBodyInterface, RequestMeasurementInterface } from "../interface";
import { CollectionResultModel, MeasurementAddModel, MeasurementCountryEditModel, MeasurementCountryModel } from "../model";
import { CountryDBModel, MeasurementCountryDBModel } from "../db-models";

export class MeasurementService {
    value: string;
    self = this;
    constructor() { }

    public async getMeasurementList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<any>> {
        const searchColumn = {'measurement_name':'measurement_name',
        'country':'country_name',
                };
        const sortColunm={'measurement_name':'measurement_name',
            'measurement_country':'country_name', 
                    }
        const postresSqlHelper = new PostgresqlHelper();
        const getQueryData = postresSqlHelper.tableListQuery(
            searchColumn,
            requestBody,
            MeasurementDBModel,
            sortColunm)
        getQueryData.include = [
            {
                model: MeasurementCountryDBModel,
                include: [CountryDBModel]

            },
        ]
        return await MeasurementDBModel.findAndCountAll(getQueryData
        )
            .then((data) => {
                return new CollectionResultModel<MeasurementInterface>(data, requestBody);
            })
            .catch((err) => {
                return err;
            });
    }



    public async addMeasurement(measure: any): Promise<any> {
        return await MeasurementDBModel.create(measure, {
            include: [MeasurementCountryDBModel]
        })

    }

    public async deleteMeasurement(requestBody: any): Promise<any> {
        return await MeasurementDBModel.update({
            status: 'inactive'
        }, {
            where: { measurement_id: requestBody }
        });
    }

    public async editMeasurement(id): Promise<any> {
        return await MeasurementDBModel.findOne({
            where: {
                measurement_id: decrypted(id),
            },
        });
    }

    public async updateMeasurement(requestBody: any): Promise<any> {
        const t = await sequelize.getSequelize.transaction();
        const country_name = requestBody.country_name.map(list => MeasurementCountryEditModel.create(list, requestBody.measurement_id));
        try {
            const result = await Promise.all([
                MeasurementDBModel.update({
                    measurement_id: requestBody.measurement_id,
                    measurement_name: requestBody.measurement_name,
                }, {
                    where: {
                        measurement_id: requestBody.measurement_id
                    },
                    transaction: t
                }),
                MeasurementCountryDBModel.destroy({
                    where: {
                        measurement_id: requestBody.measurement_id
                    },
                    transaction: t
                }),
                MeasurementCountryDBModel.bulkCreate(country_name, { transaction: t })
            ])

            await t.commit();
            return result
        }
        catch (error) {
            await t.rollback();
            return error;

        }
    }
    public async getAllMeasurement(): Promise<MeasurementInterface[]> {
        return await MeasurementDBModel.findAll({
            attributes: ['measurement_id', 'measurement_name'],
            where: {
                status: 'active'
            }
        });
    }
    public async getAllMeasurements(): Promise<any> {
        return await MeasurementDBModel.findAll({
            attributes: ['measurement_id', 'measurement_name', 'country_name'],
            where: {
                status: 'active'
            }
        });
    }

}

