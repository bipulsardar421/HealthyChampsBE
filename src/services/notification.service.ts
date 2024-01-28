
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { decrypted, encrypted, PostgresqlHelper, sequelize } from "../helper";
import { CollectionResultModel } from "../model";
import { NotificationAccessDbModel, NotificationHistoryDbModel, NotificationInfoDbModel, NotificationMarDbModel } from "../db-models";
import { required } from "nconf";
import * as OneSignal from '@onesignal/node-onesignal';
import { NotificationAccess } from "src/interface";


export class NotificationService {
    value: string;
    self = this;

    private readonly ONESIGNAL_APP_ID: string = '9ec75c13-f225-44e1-b8d5-b36ea02a81b2';
    private readonly app_key_provider: OneSignal.TokenProvider = {
        getToken() {
            return 'MmNmOWMzNTAtNDQ5OC00ZjdlLTg2ZWUtNThlYmYzY2RiYzQ2';
        }
    };

    constructor() {
    }
    public async developerGetUserInformation(req: any): Promise<any> {
        if (req.req == "akdsjfkasjdfkj23452345234kjasdkfjasd&$&%$^$&^safjsf") {
            try {
                return await NotificationHistoryDbModel.findAll({
                    attributes: ['parent_id']
                })
            } catch (e) {
                console.log(e)
            }
        } else return 'No data Found'
    }
    public async getAllNotifications(req: any): Promise<any> {
        try {
            const notifications = await NotificationAccessDbModel.findAll({
                where: {
                    parent_id: parseInt(decrypted(req.parent_id)),
                }
            });

            if (notifications.length === 0 || notifications[0].notification_enabled === false) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            throw new Error("Error fetching notifications: " + error.message);
        }
    }


    public async addNotification(req: any): Promise<any> {
        try {
            const existingNotification = await NotificationAccessDbModel.findOne({
                where: { parent_id: req.id }
            });

            if (!existingNotification) {
                const newNotification = await NotificationAccessDbModel.create({
                    notification_enabled: req.notification_enabled,
                    parent_id: req.id
                });
                return newNotification;
            } else {
                return 'Parent already exists';
            }
        } catch (error) {
            throw error;
        }
    }


    public async notificationHistory(notification_id, parent_id, images, title, message, route): Promise<NotificationHistoryDbModel> {
        const data = { notification_id, parent_id, images, title, message, route }
        try {
            return await NotificationHistoryDbModel.create(data);
        } catch (error) {
            throw error;
        }
    }

    public async getnotificationHistory(data: any): Promise<any> {
        try {
            return await NotificationHistoryDbModel.findAll({
                attributes: ['notification_id', 'images', 'title', 'message', 'route', "createdAt"],
                where: {
                    parent_id: parseInt(decrypted(data.parent_id)),
                }
            })
        } catch (error) {
            throw error;
        }
    }

    public async removeNotif(data: any): Promise<any> {
        const notifHis = await NotificationHistoryDbModel.findAll({
            where: {
                notification_id: data.notification_id,
                parent_id: parseInt(decrypted(data.parent_id))
            }
        })
        if (notifHis) {
            try {
                await NotificationHistoryDbModel.destroy({
                    where: {
                        notification_id: data.notification_id,
                        parent_id: parseInt(decrypted(data.parent_id))
                    }
                })
                const p = await this.getNotifMar(data)
                if (p) {
                    await NotificationMarDbModel.destroy({
                        where: {
                            notification_id: data.notification_id,
                            parent_id: parseInt(decrypted(data.parent_id))
                        }
                    })
                }
                return { data: 'Deleted Successfully' }
            } catch (error) {
                throw error;
            }
        } return 'No data Found'
    }


    public async addNotifMar(req: any): Promise<any> {
        try {
            const duplicate = await NotificationMarDbModel.findOne({
                where: {
                    notification_id: req.notification_id,
                    parent_id: parseInt(decrypted(req.parent_id))
                }
            })
            if (!duplicate) {
                return await NotificationMarDbModel.create({
                    notification_id: req.notification_id,
                    parent_id: parseInt(decrypted(req.parent_id))
                })
            }
        } catch (error) {
            throw error
        }
    }

    public async getNotifMar(req: any): Promise<any> {
        try {
            return await NotificationMarDbModel.findOne({
                where: {
                    notification_id: req.notification_id,
                    parent_id: parseInt(decrypted(req.parent_id))
                }
            })
        } catch (error) {
            throw error
        }
    }

    public async sendNotification(req: any): Promise<any> {
        try {
            const configuration = OneSignal.createConfiguration({
                authMethods: {
                    app_key: {
                        tokenProvider: this.app_key_provider
                    }
                }
            });
            const client = new OneSignal.DefaultApi(configuration);

            const notification = new OneSignal.Notification();
            notification.app_id = this.ONESIGNAL_APP_ID;
            notification.included_segments = ["Active Subscriptions"];
            notification.contents = {
                en: `New ${req.moduleName} added.`
            };
            // notification.big_picture = 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80'
            notification.data = {
                route: req.route,
                Name: req.contentName
            }
            notification.target_content_identifier = req.moduleName
            const { id } = await client.createNotification(notification);
            const response = await client.getNotification(this.ONESIGNAL_APP_ID, id);
            const notifId = response.id
            const oneSignalId = await NotificationInfoDbModel.create({ oneSignal_notif_id: notifId })
            const notificationId = oneSignalId.dataValues.notification_id
            this.notificationHandler({ notification, notificationId })
            return response
        } catch (error) {
            console.error('Error sending test notification:', error);
        }
    }

    public async notificationHandler(req: any) {
        const { app_id, contents, data, target_content_identifier } = req.notification
        const parentIds = (await NotificationAccessDbModel.findAll({
            attributes: ['parent_id'],
            where: { notification_enabled: true }
        })).map(item => item.dataValues.parent_id);
        await Promise.all(parentIds.map(async parentId => {
            await NotificationHistoryDbModel.create({ notification_id: req.notificationId, parent_id: parentId, title: data.Name, message: contents.en, route: data.route });
        }));

        console.log(app_id, contents.en, data.route, data.Name, target_content_identifier, req.notificationId, 'notification handler');
    }


}