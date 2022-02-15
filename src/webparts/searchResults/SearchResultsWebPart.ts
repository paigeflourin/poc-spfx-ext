import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import styles from './SearchResultsWebPart.module.scss';
import * as strings from 'SearchResultsWebPartStrings';

import { Authentication } from '../../helper/Authentication';
import { sp } from '@pnp/sp';
import * as CryptoJS from 'crypto-js';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import pnp from '@pnp/pnpjs';

require('searchUIConfig');
require('searchUI');

export interface ISearchResultsWebPartProps {
  description: string;
  username: string;
  pw: string;
  rememberMe: boolean;
  sudo: string;
}



export default class SearchResultsWebPart extends BaseClientSideWebPart<ISearchResultsWebPartProps> {

  private _authentication = new Authentication();

  //@override
  public onInit(): Promise<void> {

    sp.setup({
      spfxContext: this.context
    });

    //let userInfo: User;
    //let user = await sp.web.currentUser();

     const secret_key : string = process.env.SPFX_WEBAPI_SECRET_KEY;
     const pword : string = process.env.SPFX_WEBAPI_PW;
     //console.log("pword: ", pword);
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

     });   
    
  
     console.log("after pnp get user");
    return Promise.resolve<void>(null);
  }

  // <login-sp-widget 
  // user-name="${this.properties.username}"
  // pword="${this.properties.pw}"
  // remember-me="${this.properties.rememberMe}"
  //     spsudo="${this.properties.sudo}"
  // >
  // </login-sp-widget>
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.searchResults }">
        <div class="${ styles.container }">
          <search-results-widget class="taiger_styles"></search-results-widget>
 
        </div>
      </div>`;
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
  }
}
