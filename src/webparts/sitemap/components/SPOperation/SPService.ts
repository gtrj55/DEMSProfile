import { sp } from "@pnp/sp/presets/all";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
export class SPOperation {
    constructor(private context: IWebPartContext) {
        sp.setup({
            ie11: true,
            sp: {
                baseUrl: this.context.pageContext.site.absoluteUrl
            }
        });
        this.onInt();
    }
    private onInt() { }
    public getSiteMapHeader(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            //sp.web.lists.getByTitle('NotificationText').items.select("ID", "Message", "Title").getById(5).get().then((response: any) => {
            sp.web.lists.getByTitle('NotificationText').items.select( "Message").filter("Title eq 'Sitemap Header Text'").get().then((response: any) => {
                resolve(response);
            }, (error) => console.log(error));
        });
    }
}