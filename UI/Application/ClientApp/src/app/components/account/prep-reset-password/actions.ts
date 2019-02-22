import { FormGroup } from '@angular/forms';
import { Action } from '@ngrx/store';
import { PrepResetPasswordTypes } from './types';

export class PrepResetPassword implements Action {
    readonly type = PrepResetPasswordTypes.PREP_RESET_PASSWORD_REQUEST;
    constructor(readonly payload: FormGroup) { }
}
export class PrepResetPasswordSuccess implements Action {
    readonly type = PrepResetPasswordTypes.PREP_RESET_PASSWORD_SUCCESS;
}

export type ConfirmEmailActionsUnion = PrepResetPassword | PrepResetPasswordSuccess ;