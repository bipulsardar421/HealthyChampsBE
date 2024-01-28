import { DATE, DOUBLE, FindAndCountOptions, INTEGER, Op, QueryTypes } from 'sequelize';
import * as PostgresqlConnection from 'sequelize';
import { sequelize, SequelizeConfig } from "./sequelize.config";
import { RequestBodyInterface, SortInterface } from '../../interface';
import { Model, UpdatedAt } from 'sequelize-typescript';
import { Cast } from 'sequelize/types/utils';
import { Parser } from 'json2csv';
import { mode } from 'crypto-js';
import { SortColsInterface, SearchColsInterface } from '../../interface/searchcol.interface'


export class PostgresqlHelper {
    private _sequelize: PostgresqlConnection.Sequelize;
    private params = {};
    constructor(private query?: string) {
        this._sequelize = sequelize.getSequelize;
    }

    public addParameter(parameterName: string, value: any): void {
        this.params[parameterName] = value;
    }

    public addValues(values: any) {
        this.params = { ...this.params, ...values };
    }

    public async execute(): Promise<any> {
        return this._sequelize.query(this.query, {
            replacements: this.params,
            type: QueryTypes.RAW,
        });
    }
    public async select(): Promise<any> {
        return this._sequelize.query(this.query, {
            replacements: this.params,
            type: QueryTypes.SELECT,
        });
    }

    public async insert(): Promise<any> {
        return this._sequelize.query(this.query, {
            replacements: this.params,
            type: QueryTypes.INSERT,
        });
    }

    public async update(): Promise<any> {
        return this._sequelize.query(this.query, {
            replacements: this.params,
            type: QueryTypes.UPDATE,
        });
    }

    public async delete(): Promise<any> {
        return this._sequelize.query(this.query, {
            replacements: this.params,
            type: QueryTypes.DELETE,
        });
    }

    public async authenticate(): Promise<void> {
        return this._sequelize.authenticate();
    }

    public downloadResouce(fields, data) {
        const json2csv = new Parser({ fields });
        return json2csv.parse(data);
    }
    public tableListQuery(searchColumn: any, requestBody: Partial<RequestBodyInterface>, modelName, sortColunm?: SortColsInterface, extra?): FindAndCountOptions {
        try{
        let _sequelize = PostgresqlConnection.Sequelize;
        let query: FindAndCountOptions = {};
        const tableModel = sequelize.getSequelize.model(modelName).getAttributes()
        const searchColunm = requestBody.search && requestBody.search.column.toLocaleLowerCase() || null
        const searchTxt = requestBody.search && (searchColunm === 'all' && searchColumn || [requestBody.search.column]) || null;
        if (searchTxt) {
            console.log("searchTxt", searchTxt)
            let searchCol = [];
            if (searchColunm === 'all') {
                for (let val in searchTxt) {
                    if (searchTxt.hasOwnProperty(val)) {
                        console.log("lll", val);
                        let assocateCol = '';
                        if (sortColunm && sortColunm.hasOwnProperty(val)) {
                            assocateCol = sortColunm[val];
                        } else {
                            assocateCol = tableModel[val].references['model']
                        }
                        if (tableModel[val].type instanceof INTEGER || tableModel[val].type instanceof DOUBLE || tableModel[val].type instanceof DATE) {
                            if (tableModel[val].references) {
                                const searchCols = `$${tableModel[val].references['model']}.${assocateCol}$`
                                console.log(searchCols)
                                const objName = {};
                                objName[searchCols] = {
                                    [Op.iLike]: `%${requestBody.search.searchText.toLocaleLowerCase()}%`
                                }
                                searchCol.push(objName)
                            } else {
                                searchCol.push(
                                    _sequelize.where(
                                        _sequelize.cast(_sequelize.col(`${modelName.name}.${val}`), 'varchar(255)'),
                                        {
                                            [Op.iLike]: `%${requestBody.search.searchText.toLocaleLowerCase()}%`
                                        })
                                )
                            }
                        } else {
                            const objName = {};
                            objName[val] = {
                                [Op.iLike]: `%${requestBody.search.searchText.toString().toLocaleLowerCase()}%`
                            }
                            console.log(requestBody.search.searchText)
                            searchCol.push(objName)
                        }
                        query.where = {
                            [Op.or]: searchCol
                        }
                    }
                }
            }
            else {
                searchTxt.forEach((val: any) => {
                    console.log("lll", val);
                    let assocateCol = '';
                    if (sortColunm && sortColunm.hasOwnProperty(val)) {
                        assocateCol = sortColunm[val];
                    } else {
                        assocateCol = tableModel[val].references['model']
                    }
                    if (tableModel[val].type instanceof INTEGER || tableModel[val].type instanceof DOUBLE || tableModel[val].type instanceof DATE) {
                        if (tableModel[val].references) {
                            const searchCols = `$${tableModel[val].references['model']}.${assocateCol}$`
                            console.log(searchCols)
                            const objName = {};
                            objName[searchCols] = {
                                [Op.iLike]: `%${requestBody.search.searchText.toLocaleLowerCase()}%`
                            }
                            searchCol.push(objName)
                        } else {
                            searchCol.push(
                                _sequelize.where(
                                    _sequelize.cast(_sequelize.col(`${modelName.name}.${val}`), 'varchar(255)'),
                                    {
                                        [Op.iLike]: `%${requestBody.search.searchText.toLocaleLowerCase()}%`
                                    })
                            )
                        }
                    } else {
                        const objName = {};
                        objName[val] = {
                            [Op.iLike]: `%${requestBody.search.searchText.toString().toLocaleLowerCase()}%`
                        }
                        console.log(requestBody.search.searchText)
                        searchCol.push(objName)
                    }
                });
                query.where = {
                    [Op.or]: searchCol
                }
            }
        }
        if (requestBody.sort.length) {
            let sortedArry = []
            for (let idx in requestBody.sort) {
                let assocateCol = '';
                const sortedColum = requestBody.sort[idx].sortColunm;
                if (sortColunm && sortColunm.hasOwnProperty(sortedColum)) {
                    assocateCol = sortColunm[sortedColum];
                    console.log("ggg", sortColunm[sortedColum])
                } else {
                    assocateCol = tableModel[sortedColum].references['model']
                }
                const direction = requestBody.sort[idx].direction.toString().toLocaleUpperCase();
                if (tableModel[sortedColum]?.references && !!requestBody.sort[idx].direction) {
                    sortedArry.push([tableModel[sortedColum].references['model'], assocateCol, direction])
                    console.log("kkk", tableModel[sortedColum].references['model'])
                }
                else if (!!requestBody.sort[idx].direction) {
                    sortedArry.push([sortedColum, direction])
                }
            }
            sortedArry.push(['updatedAt', 'DESC'])
            if (sortedArry.length) {
                query.order = sortedArry;
            }
        }
        else {
            query.order = [['updatedAt', 'DESC']];
        }
        query.offset = requestBody.pageNumber * requestBody.pageSize;
        query.limit = requestBody.pageSize
        if (Object.keys(tableModel).indexOf('status') !== -1) {
            query.where = { ...query.where, ...{ status: 'active' }, ...extra }
        }
        console.log(query)
        return query;
    }
    catch(err){
        console.error(err)
    }
    }
}


