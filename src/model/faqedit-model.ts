import {  HelpandSupportInterface,HelpEditInterface } from "../interface";
    
export class FaqEditModel {
    country_code: string = '';
    phone_number: string = '';
    email_address: string = '';
    status: string = 'active';
    // faqques:FQuesInterface[]=[];
    user_id: number = 0;
   
    public static create(faqInfo?: HelpEditInterface): FaqEditModel {        
        return new FaqEditModel(faqInfo)
    }

    constructor(faqInfo?: HelpEditInterface) {
        if (faqInfo) {
            this._intFormObj(faqInfo);
        }
    }

    protected _intFormObj(faqInfo?: HelpEditInterface) {
        console.log("faqInfo",faqInfo)
        Object.assign(this, faqInfo);
        this.country_code=faqInfo.country_code;
        this.phone_number=faqInfo.phone_number;
        this.email_address=faqInfo.email_address;
      
    }
}
