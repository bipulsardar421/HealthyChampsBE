export type NotificationInterface = {
    user_fcm_id: number,
    fcm: string,
    parent_id: number,
}


export type NotificationHistory = {
    history_id: number;
    notification_id: number;
    parent_id: number;
    images: string;
    title: string;
    message: string;
    route: string;
}

export type NotificationAccess = {
    access_id: number,
    notification_enabled: boolean,
    parent_id: number
}