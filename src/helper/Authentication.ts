


import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";


import Rijndael from 'rijndael-js';


export class Authentication {

      public convertString(stringValue) : string {
     
        const data = atob(stringValue);
        
        return data;
        //let arr = Uint8Array.from(data, b => b.charCodeAt(0));
        //return arr;
      }


      public DecryptStringFromBytes(cipherText, key, IV): string {
        let plaintext : string;

        const cipher = new Rijndael(key, 'cbc');



        return plaintext;

      }
}