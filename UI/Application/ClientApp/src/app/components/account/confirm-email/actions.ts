import { FormGroup } from '@angular/forms';
import { Action } from '@ngrx/store';
import { ConfirmEmailTypes } from './types';

export class ConfirmEmailRequest implements Action {
    readonly type = ConfirmEmailTypes.CONFIRM_EMAIL_REQUEST;
    constructor(readonly payload: FormGroup) { }
}
export class ConfirmEmailSuccess implements Action {
    readonly type = ConfirmEmailTypes.CONFIRM_EMAIL_SUCCESS;
}

export type ConfirmEmailActionsUnion = ConfirmEmailRequest | ConfirmEmailSuccess ;