import { FormGroup } from '@angular/forms';
import { Action } from '@ngrx/store';
import { ChangePasswordTypes } from './types';

export class ChangePasswordRequest implements Action {
    readonly type = ChangePasswordTypes.CHANGE_PASSWORD_REQUEST;
    constructor(readonly payload: FormGroup) { }
}
export class ChangePasswordSuccess implements Action {
    readonly type = ChangePasswordTypes.CHANGE_PASSWORD_SUCCESS;
}
export class ChangePasswordError implements Action {
    readonly type = ChangePasswordTypes.CHANGE_PASSWORD_ERROR;
    constructor(readonly error) { }
}
export class ResetError implements Action {
    readonly type = ChangePasswordTypes.RESET_ERROR;
}

export type ChangePasswordActionsUnion = ChangePasswordRequest | ChangePasswordSuccess | ChangePasswordError | ResetError;