import { BaseModel } from "./base.model";

export class OpenIdConnectRequestModel extends BaseModel {

    public grant_type: string = null;
    public scope: string = null;
    public username: string = null;
    public password: string = null;
    public refresh_token: string = null;

    constructor(model?: Partial<OpenIdConnectRequestModel>) {
        super();
        this.setModel(model);
    }
}
