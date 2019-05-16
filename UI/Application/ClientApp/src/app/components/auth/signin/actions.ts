import { FormGroup } from '@angular/forms';
import { Action } from '@ngrx/store';
import { IToken } from '@renet-consulting/auth';
import { SigninTypes } from './types';

export class SigninRequest implements Action {
    readonly type = SigninTypes.SIGNIN_REQUEST;
    constructor(readonly payload: FormGroup) { }
}
export class SigninSuccess implements Action {
    readonly type = SigninTypes.SIGNIN_SUCCESS;
    constructor(readonly payload: FormGroup, readonly success: IToken) { }
}
export class SigninError implements Action {
    readonly type = SigninTypes.SIGNIN_ERROR;
    constructor(readonly error) { }
}

export class ResetError implements Action {
    readonly type = SigninTypes.RESET_ERROR;
}

export type SigninActionsUnion = SigninRequest | SigninSuccess | SigninError | ResetError;