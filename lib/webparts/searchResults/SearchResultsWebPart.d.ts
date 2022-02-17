import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
export interface ISearchResultsWebPartProps {
    description: string;
    username: string;
    pw: string;
    rememberMe: boolean;
    sudo: string;
}
export default class SearchResultsWebPart extends BaseClientSideWebPart<ISearchResultsWebPartProps> {
    private _authentication;
    onInit(): Promise<void>;
    render(): void;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=SearchResultsWebPart.d.ts.map