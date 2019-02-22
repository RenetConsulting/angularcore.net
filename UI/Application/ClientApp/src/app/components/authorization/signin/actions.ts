import { FormGroup } from '@angular/forms';
import { Action } from '@ngrx/store';
import { SigninTypes } from './types';

export class Signin implements Action {
    readonly type = SigninTypes.SIGNIN_REQUEST;
    constructor(readonly payload: FormGroup) { }
}
export class SigninSuccess implements Action {
    readonly type = SigninTypes.SIGNIN_SUCCESS;
}
export class SigninError implements Action {
    readonly type = SigninTypes.SIGNIN_ERROR;
    constructor(readonly error) { }
}

export type SigninActionsUnion = Signin | SigninSuccess | SigninError;