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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';
import * as strings from 'SearchBarApplicationCustomizerStrings';
import styles from './SearchBarApplicationCustomizer.module.scss';
var LOG_SOURCE = 'SearchBarApplicationCustomizer';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import pnp from '@pnp/pnpjs';
// require('searchUIConfig');
// require('searchUI');
import { Authentication } from '../../helper/Authentication';
import * as CryptoJS from 'crypto-js';
/** A Custom Action which can be run during execution of a Client Side Application */
var SearchBarApplicationCustomizer = /** @class */ (function (_super) {
    __extends(SearchBarApplicationCustomizer, _super);
    function SearchBarApplicationCustomizer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //private _bottomPlaceholder: PlaceholderContent | undefined;
        _this._authentication = new Authentication();
        return _this;
    }
    SearchBarApplicationCustomizer.prototype.onInit = function () {
        var _this = this;
        console.log("app init");
        Log.info(LOG_SOURCE, "Initialized " + strings.Title);
        sp.setup({
            spfxContext: this.context
        });
        //let userInfo: User;
        var secret_key = process.env.SPFX_WEBAPI_SECRET_KEY;
        var pword = process.env.SPFX_WEBAPI_PW;
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
            console.log(spUser.LoginName);
            console.log(_this.properties);
            // Wait for the placeholders to be created (or handle them being changed) and then
            // render.
            _this.context.placeholderProvider.changedEvent.add(_this, _this._renderPlaceHolders);
        });
        return Promise.resolve(null);
    };
    SearchBarApplicationCustomizer.prototype._renderPlaceHolders = function () {
        console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
        console.log("Available placeholders: ", this.context.placeholderProvider.placeholderNames
            .map(function (name) { return PlaceholderName[name]; })
            .join(", "));
        // Handling the top placeholder
        if (!this._topPlaceholder) {
            console.log("no placeholder found");
            this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this._onDispose });
            // The extension should not assume that the expected placeholder is available.
            if (!this._topPlaceholder) {
                console.error("The expected placeholder (Top) was not found.");
                return;
            }
            if (this.properties) {
                var topString = this.properties.Top;
                if (!topString) {
                    topString = "(Top property was not defined.)";
                }
                console.log(this._topPlaceholder);
                if (this._topPlaceholder.domElement) {
                    this._topPlaceholder.domElement.innerHTML = "\n            <div class=\"" + styles.app + "\">\n              <div class=\"" + styles.top + "\">\n                \n                <div id=app class=\"" + styles.searchbarImp + "\">\n                  <div> Hello World Customizer </div>\n                </div>\n              </div>\n                \n            </div>";
                }
            }
        }
    };
    SearchBarApplicationCustomizer.prototype._onDispose = function () {
        console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    };
    __decorate([
        override
    ], SearchBarApplicationCustomizer.prototype, "onInit", null);
    return SearchBarApplicationCustomizer;
}(BaseApplicationCustomizer));
export default SearchBarApplicationCustomizer;
//# sourceMappingURL=SearchBarApplicationCustomizer.js.map