import { FormGroup } from "@angular/forms";
import { Action } from "@ngrx/store";
import { SettingsTypes } from "./types";

export class UpdatePersonRequest implements Action {
    readonly type = SettingsTypes.UPDATE_PERSON_REQUEST;
    constructor(readonly payload: FormGroup) { }
}

export class UpdatePersonSuccess implements Action {
    readonly type = SettingsTypes.UPDATE_PERSON_SUCCESS;
    constructor() { }
}

export class UpdatePersonError implements Action {
    readonly type = SettingsTypes.UPDATE_PERSON_ERROR;
    constructor(readonly error) { }
}

export type SettingsUnion = UpdatePersonRequest | UpdatePersonSuccess | UpdatePersonError;