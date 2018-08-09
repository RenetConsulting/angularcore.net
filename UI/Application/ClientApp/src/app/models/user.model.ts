import { BaseModel } from "./base.model";

export class UserModel extends BaseModel {

    public email: string = null;
    public password: string = null;
    public confirmPassword: string = null;

    constructor(model?: UserModel) {
        super();
        this.setModel(model);
    }
}
