import {  HelpandSupportInterface,HelpEditInterface } from "../interface";
    
export class HelpEditModel {
    country_code: string = '';
    phone_number: string = '';
    email_address: string = '';
    status: string = 'active';
    user_id: number = 0;
   
    public static create(contactInfo?: HelpEditInterface): HelpEditModel {        
        return new HelpEditModel(contactInfo)
    }

    constructor(contactInfo?: HelpEditInterface) {
        if (contactInfo) {
            this._intFormObj(contactInfo);
        }
    }

    protected _intFormObj(contactInfo?: HelpEditInterface) {
        console.log("contactInfo",contactInfo)
        Object.assign(this, contactInfo);
        this.country_code=contactInfo.country_code;
        this.phone_number=contactInfo.phone_number;
        this.email_address=contactInfo.email_address;
      
    }
}