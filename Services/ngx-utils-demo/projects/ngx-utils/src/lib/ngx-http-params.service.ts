import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isNumber, isObject, isString } from 'util';

@Injectable({
    providedIn: 'root'
})
export class NgxHttpParamsService {

    constructor() { }

    /**
     *
     * @param model an object with property type {@link string}, {@link number}, {@link Array}, {@link object}
     * @param prefix a util to set the right value of param for the property with the type {@link object}
     */
    getParams<ItemType extends object>(model: ItemType, prefix: string = ''): HttpParams {
        /** immutable */
        let params = new HttpParams();
        Object.keys(model).forEach(key => {
            const value = model[key];
            const param = `${prefix}${key}`;
            if (isString(value)) {
                params = params.append(param, value);
            }
            else if (isNumber(value)) {
                params = params.append(param, value.toString());
            }
            else if (Array.isArray(value)) {
                value.forEach(x => params = params.append(param, x));
            }
            else if (isObject(value) && value) {
                const subPrams = this.getParams(value, `${param}.`);
                subPrams.keys().forEach(subKey => params = params.append(subKey, subPrams.get(subKey)));
            }
        });
        return params;
    }
}
