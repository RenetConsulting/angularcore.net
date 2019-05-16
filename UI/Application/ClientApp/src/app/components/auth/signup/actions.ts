import { FormGroup } from '@angular/forms';
import { Action } from '@ngrx/store';
import { SigninSuccess } from '../signin/actions';
import { SignupTypes } from './types';

export class SignupRequest implements Action {
    readonly type = SignupTypes.SIGNUP_REQUEST;
    constructor(readonly payload: FormGroup) { }
}
export class SignupSuccess implements Action {
    readonly type = SignupTypes.SIGNUP_SUCCESS;
}
export class SignupError implements Action {
    readonly type = SignupTypes.SIGNUP_ERROR;
    constructor(readonly error) { }
}

export type SignupActionsUnion = SignupRequest | SignupSuccess | SignupError | SigninSuccess;