import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { SetError, SetSuccessMessage } from '../../../actions/error.actions';
import { MessagesType } from '../../../enums/messages.type';
import { AccountService } from '../../../services/account/account.service';
import { PrepResetPassword, PrepResetPasswordSuccess } from './actions';
import { PrepResetPasswordTypes } from './types';

@Injectable()
export class PrepResetPasswordEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AccountService) private accountService: AccountService
    ) { }

    @Effect() prepResetPassword = this.actions.pipe(
        ofType<PrepResetPassword>(PrepResetPasswordTypes.PREP_RESET_PASSWORD_REQUEST),
        mergeMap(x => this.accountService.prepResetPassword(x.payload.controls.email.value).pipe(
            tap(() => x.payload.reset()),
            mapTo(new PrepResetPasswordSuccess()),
            catchError(e => of(new SetError(e.error)))
        ))
    );

    @Effect() prepResetPasswordSuccess = this.actions.pipe(
        ofType<PrepResetPasswordSuccess>(PrepResetPasswordTypes.PREP_RESET_PASSWORD_SUCCESS),
        mapTo(new SetSuccessMessage(MessagesType.checkEmail))
    );
}