export class BaseModel {

    constructor() { }

    public setModel?= (model: any): void => {
        if (model != null) {
            for (let key in model) {
                if (key in this) {
                    if (model[key] != null) {
                        if (typeof this[key] == "object" && this[key] != null) {
                            if (typeof this[key] == typeof model[key]) {
                                this[key] = model[key];
                            }
                        }
                        else {
                            this[key] = model[key];
                        }
                    }
                }
            }
        }
        delete this.setModel;
    }
}
