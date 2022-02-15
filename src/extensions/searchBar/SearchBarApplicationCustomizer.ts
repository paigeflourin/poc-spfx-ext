import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'SearchBarApplicationCustomizerStrings';
import styles from './SearchBarApplicationCustomizer.module.scss';

const LOG_SOURCE: string = 'SearchBarApplicationCustomizer';

import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import pnp from '@pnp/pnpjs';

require('searchUIConfig');
require('searchUI');

import { Authentication } from '../../helper/Authentication';

import * as CryptoJS from 'crypto-js';


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISearchBarApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  Bottom: string;
  BackendBaseURL: string;
  pw: string;
  username: string;
  rememberMe: boolean;
  sudo: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SearchBarApplicationCustomizer
  extends BaseApplicationCustomizer<ISearchBarApplicationCustomizerProperties> {
    
    private _topPlaceholder: PlaceholderContent | undefined;
    //private _bottomPlaceholder: PlaceholderContent | undefined;
    private _authentication = new Authentication();
    
    @override
    public onInit(): Promise<void> {
  
      console.log("app init");
      Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
  
      sp.setup({
        spfxContext: this.context
      });
  
      //let userInfo: User;
  
  
       const secret_key : string = process.env.SPFX_WEBAPI_SECRET_KEY;
       const pword : string = process.env.SPFX_WEBAPI_PW;
       let pw = this._authentication.convertString(pword);
       let encryptpw = CryptoJS.AES.encrypt(pw, secret_key).toString();
        
  
        
       pnp.sp.web.currentUser.get().then(spUser => {
  
          let domsplit = spUser.UserPrincipalName.split('@');
          let username = domsplit[0];
          let domainsplit = domsplit[1];
          let domain = domainsplit.split('.')[0];
          let sudo = domain + "\\" + username;
  
         this.properties.sudo = sudo;
         this.properties.pw = encryptpw;
         this.properties.username = "sysadmin";
         this.properties.rememberMe = true;
  
         console.log(spUser.LoginName);
         console.log(this.properties);
  
          // Wait for the placeholders to be created (or handle them being changed) and then
        // render.
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
  
       });   
      
    
      return Promise.resolve<void>(null);
    }
  
    private _renderPlaceHolders(): void {
      console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
      console.log(
        "Available placeholders: ",
        this.context.placeholderProvider.placeholderNames
          .map(name => PlaceholderName[name])
          .join(", ")
      );
    
      // Handling the top placeholder
      if (!this._topPlaceholder) {
        console.log("no placeholder found");
        this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose }
        );
    
        // The extension should not assume that the expected placeholder is available.
        if (!this._topPlaceholder) {
          console.error("The expected placeholder (Top) was not found.");
          return;
        }
    
        if (this.properties) {
          let topString: string = this.properties.Top;
          if (!topString) {
            topString = "(Top property was not defined.)";
          }
    
          console.log(this._topPlaceholder);
          if (this._topPlaceholder.domElement) {
            this._topPlaceholder.domElement.innerHTML = `
            <div class="${styles.app}">
              <div class="${styles.top}">
                
                <div id=app class="${styles.searchbarImp}">
                  <login-sp-widget 
                      user-name="${this.properties.username}"
                      pword="${this.properties.pw}"
                      remember-me="${this.properties.rememberMe}"
                      spsudo="${this.properties.sudo}"
                  >
                  </login-sp-widget>
                  <search-bar-widget
                    class="taiger_styles"
                    style="display: block; margin:4px;"
                    redirect-on-search="true"
                    search-endpoint="https://taigers.sharepoint.com/SitePages/Test-Page-for-searchbar.aspx"
                  >
                  </search-bar-widget>
                </div>
              </div>
                
            </div>`;
          }
        }
      }

    }

    private _onDispose(): void {
      console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }

}
