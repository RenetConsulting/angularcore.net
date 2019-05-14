import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
import { SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { AccountService } from '~/services/account/account.service';
import { ResendConfirmationRequest, ResendConfirmationError, ResendConfirmationSuccess } from './actions';
import { ResendConfirmationTypes } from './types';

@Injectable()
export class ResendConfirmationEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AccountService) private accountService: AccountService,
    ) { }

    @Effect() resendConfirmationRequest = this.actions.pipe(
        ofType<ResendConfirmationRequest>(ResendConfirmationTypes.RESEND_CONFIRMATION_REQUEST),
        mergeMap(x => this.accountService.resendConfirmation(x.payload).pipe(
            mapTo(new ResendConfirmationSuccess()),
            catchError(e => of(new ResendConfirmationError(e.error)))
        ))
    );

    @Effect() resendConfirmationSuccess = this.actions.pipe(
        ofType<ResendConfirmationSuccess>(ResendConfirmationTypes.RESEND_CONFIRMATION_SUCCESS),
        mapTo(new SetSuccess(MessagesType.checkEmail))
    );
}