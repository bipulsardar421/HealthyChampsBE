import * as util from 'util';
import * as bcrypt from 'bcryptjs';


export class EncriptPasswordHelper {
//   private _scrypt = util.promisify(crypto.scrypt)
//   private _salt = crypto.genSalt;

  public async getEncrytoPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } 

  public async validationPassword(password: string, dbPassword: string): Promise<boolean> {
   // const salt = await bcrypt.genSalt(10);
   console.log(await this.getEncrytoPassword(password))
    return await bcrypt.compare(password, dbPassword);
  }
}