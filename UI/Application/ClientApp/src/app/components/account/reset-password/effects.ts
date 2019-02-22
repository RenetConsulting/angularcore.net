import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { SetSuccessMessage } from '../../../actions/error.actions';
import { MessagesType } from '../../../enums/messages.type';
import { AccountService } from '../../../services/account/account.service';
import { ResetPassword, ResetPasswordError, ResetPasswordSuccess } from './actions';
import { ResetPasswordTypes } from './types';

@Injectable()
export class ResetPasswordEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AccountService) private accountService: AccountService,
    ) { }

    @Effect() resetPassword = this.actions.pipe(
        ofType<ResetPassword>(ResetPasswordTypes.RESET_PASSWORD_REQUEST),
        mergeMap(x => this.accountService.resetPassword(x.payload.value).pipe(
            tap(()=> x.payload.reset()),
            mapTo(new ResetPasswordSuccess()),
            catchError(e => of(new ResetPasswordError(e.error)))
        ))
    );

    @Effect() resetPasswordSuccess = this.actions.pipe(
        ofType<ResetPasswordSuccess>(ResetPasswordTypes.RESET_PASSWORD_SUCCESS),
        mapTo(new SetSuccessMessage(MessagesType.passwordHasChanged))
    );
}