import { BaseModel } from "./base";

export class ResponseTokenModel extends BaseModel {

    public access_token: string = null;
    public refresh_token: string = null;
    public expires_in: number = null;
    public expired_at: string = null;
    public token_type: string = null;
    public auth_time: string = null;

    constructor(model?: ResponseTokenModel) {
        super();
        this.setModel(model);
    }
}