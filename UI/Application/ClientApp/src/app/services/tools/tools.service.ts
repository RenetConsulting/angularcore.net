import { Injectable } from "@angular/core";

@Injectable()
export class ToolsService {

    constructor() { }

    public getQueryString = (model: Object): string => {
        let result: string = "";
        model = this.cleanModel(model);
        if (model != null) {
            for (let key in model) {
                let value = model[key];
                if (value != null && typeof value != "function" && typeof value != "object") {
                    if (typeof value == "string") {
                        value = value.trim();
                    }
                    result += `&${key}=${encodeURIComponent(value)}`;
                }
            }
        }
        result = result.replace(/^&/, "?");
        result.trim();
        return result;
    }

    public cleanModel = <I>(model: I): I => {
        if (model instanceof Object) {
            for (let key in model) {
                let value = model[key];
                if (value == null || typeof value == "function" || (typeof value == "object" && !Array.isArray(value))) {
                    delete model[key];
                }
                if (typeof value == "string" && value.length == 0) {
                    delete model[key];
                }
            }
        }
        return model;
    }
}