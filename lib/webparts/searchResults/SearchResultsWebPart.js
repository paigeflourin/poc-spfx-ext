var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import styles from './SearchResultsWebPart.module.scss';
import * as strings from 'SearchResultsWebPartStrings';
import { Authentication } from '../../helper/Authentication';
import { sp } from '@pnp/sp';
import * as CryptoJS from 'crypto-js';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import pnp from '@pnp/pnpjs';
var SearchResultsWebPart = /** @class */ (function (_super) {
    __extends(SearchResultsWebPart, _super);
    function SearchResultsWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._authentication = new Authentication();
        return _this;
    }
    //@override
    SearchResultsWebPart.prototype.onInit = function () {
        var _this = this;
        sp.setup({
            spfxContext: this.context
        });
        //let userInfo: User;
        //let user = await sp.web.currentUser();
        var secret_key = process.env.SPFX_WEBAPI_SECRET_KEY;
        var pword = process.env.SPFX_WEBAPI_PW;
        //console.log("pword: ", pword);
        var pw = this._authentication.convertString(pword);
        var encryptpw = CryptoJS.AES.encrypt(pw, secret_key).toString();
        pnp.sp.web.currentUser.get().then(function (spUser) {
            var domsplit = spUser.UserPrincipalName.split('@');
            var username = domsplit[0];
            var domainsplit = domsplit[1];
            var domain = domainsplit.split('.')[0];
            var sudo = domain + "\\" + username;
            _this.properties.sudo = sudo;
            _this.properties.pw = encryptpw;
            _this.properties.username = "sysadmin";
            _this.properties.rememberMe = true;
        });
        console.log("after pnp get user");
        return Promise.resolve(null);
    };
    // <login-sp-widget 
    // user-name="${this.properties.username}"
    // pword="${this.properties.pw}"
    // remember-me="${this.properties.rememberMe}"
    //     spsudo="${this.properties.sudo}"
    // >
    // </login-sp-widget>
    SearchResultsWebPart.prototype.render = function () {
        this.domElement.innerHTML = "\n      <div class=\"" + styles.searchResults + "\">\n        <div class=\"" + styles.container + "\">\n          <div>Hello World</div>\n \n        </div>\n      </div>";
    };
    // protected get dataVersion(): Version {
    //   return Version.parse('1.0');
    // }
    SearchResultsWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return SearchResultsWebPart;
}(BaseClientSideWebPart));
export default SearchResultsWebPart;
//# sourceMappingURL=SearchResultsWebPart.js.map