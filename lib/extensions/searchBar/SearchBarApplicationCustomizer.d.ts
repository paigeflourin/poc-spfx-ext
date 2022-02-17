import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISearchBarApplicationCustomizerProperties {
    Top: string;
    Bottom: string;
    BackendBaseURL: string;
    pw: string;
    username: string;
    rememberMe: boolean;
    sudo: string;
}
/** A Custom Action which can be run during execution of a Client Side Application */
export default class SearchBarApplicationCustomizer extends BaseApplicationCustomizer<ISearchBarApplicationCustomizerProperties> {
    private _topPlaceholder;
    private _authentication;
    onInit(): Promise<void>;
    private _renderPlaceHolders;
    private _onDispose;
}
//# sourceMappingURL=SearchBarApplicationCustomizer.d.ts.map