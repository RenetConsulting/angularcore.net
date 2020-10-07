import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isBoolean, isNumber, isObject, isString } from '@renet-consulting/util';

@Injectable({
    providedIn: 'root'
})
export class NgxHttpParamsService {

    constructor() { }

    /**
     * the method maps any model {@link ItemType} to {@link HttpParams}
     * @param model an object with property type {@link string}, {@link number}, {@link Array}, {@link object}
     * @param prefix a util to set the right value of param for the property with the type {@link object}
     */
    map<ItemType extends object>(model: ItemType, prefix: string = '', addObjectName: boolean = true): HttpParams {
        /** immutable */
        let params = new HttpParams();
        if (model) {
            Object.keys(model).forEach(key => {
                const value = model[key];
                const param = `${prefix}${key}`;
                if (isString(value)) {
                    params = params.append(param, value);
                }
                else if (isNumber(value)) {
                    params = params.append(param, value.toString());
                }
                else if (isBoolean(value)) {
                    params = params.append(param, value.toString());
                }
                else if (Array.isArray(value)) {
                    value.forEach(x => params = params.append(param, x));
                }
                else if (isObject(value) && value) {
                    const subPrams = this.map(value, (addObjectName)?`${param}.`:``);
                    subPrams.keys().forEach(subKey => params = params.append(subKey, subPrams.get(subKey)));
                }
            });
        }
        return params;
    }
}
