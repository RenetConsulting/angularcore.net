import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
import { SetSuccessMessage } from '../../../../actions/error.actions';
import { MessagesType } from '../../../../enums/messages.type';
import { AccountService } from '../../../../services/account/account.service';
import { ResendConfirmation, ResendConfirmationError, ResendConfirmationSuccess } from './actions';
import { ResendConfirmationTypes } from './types';

@Injectable()
export class ResendConfirmationEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AccountService) private accountService: AccountService,
    ) { }

    @Effect() resendConfirmation = this.actions.pipe(
        ofType<ResendConfirmation>(ResendConfirmationTypes.RESEND_CONFIRMATION_REQUEST),
        mergeMap(x => this.accountService.resendConfirmation(x.payload).pipe(
            mapTo(new ResendConfirmationSuccess()),
            catchError(e => of(new ResendConfirmationError(e.error)))
        ))
    );

    @Effect() resendConfirmationSuccess = this.actions.pipe(
        ofType<ResendConfirmationSuccess>(ResendConfirmationTypes.RESEND_CONFIRMATION_SUCCESS),
        mapTo(new SetSuccessMessage(MessagesType.checkEmail))
    );
}