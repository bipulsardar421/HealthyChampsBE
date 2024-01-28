import { Router, Request, Response } from "express";
import { AppRoute } from "../app-route";
import AppLogger from "..//helper/app-logger";
import { Api, decrypted, encrypted, PostgresqlHelper } from "../helper";
import { NotificationService, WishListService } from "../services";
import admin from "../assets_firebase/firebaseInit"
import { NotificationHistory } from "src/interface";


export class NotificationController implements AppRoute {
    route = "/notification";
    router: Router = Router();



    constructor() {
        this.router.post("/getAllNotificationAccess", this.getAll.bind(this));
        this.router.post("/addNotificationAccess", this.addNotificationAccess.bind(this));
        this.router.post("/testNotification", this.sendTestNotification.bind(this));
        this.router.post("/addHistory", this.notificationHistory.bind(this));
        this.router.post("/getHistory", this.getHistory.bind(this));
        this.router.put("/removeHistory", this.removeNotificationHistory.bind(this));

        this.router.post("/addNotifMar", this.addNotifMar.bind(this));
        this.router.post("/getNotifMar", this.getNotifMar.bind(this));


        this.router.post("/devUserInformation", this.dev.bind(this));

    }

    public async getAll(req: any, res: any): Promise<void> {
        try {
            res.json(await (new NotificationService()).getAllNotifications(req.body));
        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching notifications with parent info." });
        }
    }

    public async addNotificationAccess(req: Request, res: Response): Promise<void> {
        try {
            res.json(await (new NotificationService()).addNotification({ notification_enabled: req.body.notification_enabled, id: parseInt(decrypted(req.body.parent_id)) }));
        } catch (error) {
            res.status(500).json({ error: "An error occurred while adding a notification." });
            throw error;
        }
    }

    public async notificationHistory(req: Request, res: Response): Promise<void> {
        const { access_id, images, title, message, route } = req.body, parent_id = parseInt(decrypted(req.body.parent_id))
        if (await (new NotificationService()).getAllNotifications({ parent_id: req.body.parent_id }) == true) {
            try {
                res.json(await (new NotificationService()).notificationHistory(access_id, parent_id, images, title, message, route));
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred while creating a notification history record." });
            }
        } else { res.json('Notification Not Enabled') }
    }


    public async getHistory(req: any, res: any): Promise<void> {
        try {
            res.json(await (new NotificationService()).getnotificationHistory(req.body));
        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching notifications with parent info." });
        }
    }

    public async addNotifMar(req: any, res: any): Promise<any> {
        const notifMar = await (new NotificationService()).addNotifMar(req.body)
        if (notifMar) {
            res.json({ notifMar, message: "Notification Added as Marked as Read" });
        }
        else res.json('Something went wrong')
    }

    public async getNotifMar(req: any, res: any): Promise<any> {
        const notifMar = await (new NotificationService()).getNotifMar(req.body)
        if (notifMar) {
            res.json(notifMar);
        }
        else res.json('No Data Found')
    }

    public async removeNotificationHistory(req: any, res: any): Promise<void> {
        try {
            res.json(await (new NotificationService()).removeNotif(req.body))
        } catch (error) {
            console.log(error);
        }
    }
    public async sendTestNotification(req: Request, res: Response) {
        const notification = new NotificationService();
        try {
            const p = await notification.sendNotification(req);
            res.json(p);
        }
        catch (error) {
            console.log(error);

        }
    }

    public async dev(req: Request, res: Response) {
        const p = await (new NotificationService()).developerGetUserInformation(req.body)
        const encryptedData = {};
        p.forEach(item => {
            const parent_id = item.parent_id;
            const encryptedValue = encrypted(parent_id);
            encryptedData[parent_id] = encryptedValue;
        });
        res.json(encryptedData);
    }

}
