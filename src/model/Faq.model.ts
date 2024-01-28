import { decrypted } from "../helper";
import {  HelpandSupportInterface,HelpFAQInterface } from "../interface";

export class FAQModel {
    faq_title: string = '';
    faq_description: string = '';
    status: string = 'active';
    public static create(faqAry?: HelpFAQInterface,faqId?: number): FAQModel {
        return new FAQModel(faqAry,faqId);
      }
    
      constructor(faqAry?: HelpFAQInterface, faqId?: number) {
        this._initObject(faqAry)
      }
      protected _initObject(faqAry?: HelpFAQInterface) {
        this.faq_title = faqAry.faq_title;
        this.faq_description = faqAry.faq_description;
        
      }
}