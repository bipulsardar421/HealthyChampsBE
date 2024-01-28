import * as cryptojs from "crypto-js";

var key = cryptojs.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
​
var iv = cryptojs.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

export function encrypted(text: number): any {
  const encryptMsg = cryptojs.AES.encrypt(text.toString(), key, { iv: iv }).toString();
  return encryptMsg.toString().replace(/\+/g,'xMl3Jk').replace(/\//g,'Por21Ld').replace(/\=/g,'Ml32');
}

export function decrypted(text: string): string {
  const txt = text.toString().replace(/xMl3Jk/g, '+' ).replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
  const de = cryptojs.AES.decrypt(txt, key, { iv: iv });
  return de.toString(cryptojs.enc.Utf8);
}
