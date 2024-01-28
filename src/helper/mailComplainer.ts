import * as fs from 'fs';
import * as path from 'path';
import { ConfigManager } from '../config';

export class MailCompliper {

    private _config = new ConfigManager().config;
    private _folderName = this._config.NODE_ENV === 'production' ? 'src/upload/mail_content' : '../upload/mail_content';
    public filePath = path.join(__dirname, this._folderName)
    
    public readHTMLFile(path: string, callback: Function) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
               callback(err);                 
            }
            else {  
                callback(null, html);
            }
        });
    }
 }
