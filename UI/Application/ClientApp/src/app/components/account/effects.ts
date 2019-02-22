import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
import { AccountService } from '../../services/account/account.service';
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
}