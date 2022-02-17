import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import Rijndael from 'rijndael-js';
var Authentication = /** @class */ (function () {
    function Authentication() {
    }
    Authentication.prototype.convertString = function (stringValue) {
        var data = atob(stringValue);
        return data;
        //let arr = Uint8Array.from(data, b => b.charCodeAt(0));
        //return arr;
    };
    Authentication.prototype.DecryptStringFromBytes = function (cipherText, key, IV) {
        var plaintext;
        var cipher = new Rijndael(key, 'cbc');
        return plaintext;
    };
    return Authentication;
}());
export { Authentication };
//# sourceMappingURL=Authentication.js.map