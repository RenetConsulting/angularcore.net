import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { SetError, SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { AccountService } from '~/services/account/account.service';
import { filterError } from '~/utils/filter.error';
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
            tap(() => x.payload.reset()),
            mapTo(new ResetPasswordSuccess()),
            catchError(e => of(new ResetPasswordError(e.error)))
        ))
    );

    @Effect() resetPasswordSuccess = this.actions.pipe(
        ofType<ResetPasswordSuccess>(ResetPasswordTypes.RESET_PASSWORD_SUCCESS),
        mapTo(new SetSuccess(MessagesType.passwordHasChanged))
    );


    @Effect() resetPasswordError = this.actions.pipe(
        ofType<ResetPasswordError>(ResetPasswordTypes.RESET_PASSWORD_ERROR),
        filter(filterError),
        map(e => new SetError(e.error))
    );
}