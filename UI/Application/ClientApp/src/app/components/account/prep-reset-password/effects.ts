import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { MessageRequest } from '../../../actions/message.actions';
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
            catchError(() => EMPTY)
        ))
    );

    @Effect() prepResetPasswordSuccess = this.actions.pipe(
        ofType<PrepResetPasswordSuccess>(PrepResetPasswordTypes.PREP_RESET_PASSWORD_SUCCESS),
        mapTo(new MessageRequest(MessagesType.checkEmail))
    );
}