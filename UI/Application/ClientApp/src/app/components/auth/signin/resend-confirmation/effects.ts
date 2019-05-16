import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, mapTo, mergeMap, withLatestFrom } from 'rxjs/operators';
import { SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { RootStore } from '~/reducers';
import { AccountService } from '~/services/account/account.service';
import { selectAuthUser } from '../../selectors';
import { ResendConfirmationError, ResendConfirmationRequest, ResendConfirmationSuccess } from './actions';
import { ResendConfirmationTypes } from './types';

@Injectable()
export class ResendConfirmationEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AccountService) private accountService: AccountService,
        @Inject(Store) private store: Store<RootStore>,
    ) { }

    @Effect() resendConfirmationRequest = this.actions.pipe(
        ofType<ResendConfirmationRequest>(ResendConfirmationTypes.RESEND_CONFIRMATION_REQUEST),
        withLatestFrom(this.store.select(selectAuthUser)),
        filter(([_, user]) => !!user),
        mergeMap(([_, user]) => this.accountService.resendConfirmation(user.email).pipe(
            mapTo(new ResendConfirmationSuccess()),
            catchError(e => of(new ResendConfirmationError(e.error)))
        ))
    );

    @Effect() resendConfirmationSuccess = this.actions.pipe(
        ofType<ResendConfirmationSuccess>(ResendConfirmationTypes.RESEND_CONFIRMATION_SUCCESS),
        mapTo(new SetSuccess(MessagesType.checkEmail))
    );
}