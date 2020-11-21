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

    public getCurrentUserInformation(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            sp.web.currentUser.get().then((r: any) => {
                console.log(r['Title']);
                resolve(r['Title']);
            });
        });
    }
    public GetItemFilteredByUser(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.getCurrentUserInformation().then((userName: string) => {
                sp.web.lists.getByTitle("Employee").items.filter("Requester/Title eq '" + userName + "'").expand("Requester").select("Requester/Id", "Title").getAll().then((r: any) => {
                    console.log(r);
                }, (error) => console.log(error));
            });
        });
    }
    public GetItemFilteredByUserContext(context: IWebPartContext): Promise<any> {
        //let restapi:string="https://gautamtestsite2.sharepoint.com/Lists/Employee/AllItems.aspx?InPlaceSearchQuery=Hello"
        let restapi: string = "https://gautamtestsite3.sharepoint.com/Lists/Employee/AllItems.aspx?InPlaceSearchQuery=Hello";
        return new Promise<any>(async (resolve, reject) => {
            context.spHttpClient.get(restapi, SPHttpClient.configurations.v1).then((response: any) => {
                response.text().then((result: any) => {
                    let data = result.split('= { "Row" :')[1];
                    let data1 = data.split(',"FirstRow"')[0];
                    let JsonData = JSON.parse(data1);
                    resolve(JsonData);
                }, (error) => console.log(error));
            });
        });
    }
    public getNotification(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
           // this.getCurrentUserInformation().then((userName: string) => {
                sp.web.lists.getByTitle('Notification').items.top(5000).orderBy("Created", false).select("ID", "Author/Title", "Message", "Title", "Created", "Read").expand("Author").get().then((response: any) => {
                    //sp.web.lists.getByTitle('Notification').items.top(5000).orderBy("Created", false).select("ID", "Author/Title", "Message", "Title", "Created", "Read").expand("Author").filter("Title ne 'Search Profile'").get().then((response: any) => {
                    //console.log(response);
                    resolve(response);
                }, (error) => console.log(error));
            //});
        });
    }
    public UpdateReadNotification(ItemID: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            sp.web.lists.getByTitle("Notification").items.getById(Number(ItemID)).update({ Read: true }).then((results: any) => {
                resolve(ItemID);
            }, (error) => console.log(error));
        });
    }
    public deleteNotification(ItemID: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            sp.web.lists.getByTitle("Notification").items.getById(Number(ItemID)).delete().then((results: any) => {
                resolve(ItemID);
            }, (error) => console.log(error));
        });
    }

}