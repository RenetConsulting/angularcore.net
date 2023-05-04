import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, mapTo, mergeMap  } from 'rxjs/operators';
import { SetSuccess } from '~/actions/messenger.actions';
import { Messages } from '~/consts/messages';
import { AccountService } from '~/services/account/account.service';
import { ConfirmEmailRequest, ConfirmEmailSuccess } from './actions';
import { ConfirmEmailTypes } from './types';

@Injectable()
export class ConfirmEmailEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AccountService) private accountService: AccountService,
    ) { }

     confirmEmailRequest = createEffect(() => this.actions.pipe(
        ofType<ConfirmEmailRequest>(ConfirmEmailTypes.CONFIRM_EMAIL_REQUEST),
        mergeMap(x => this.accountService.confirmEmail(x.payload.value).pipe(
            mapTo(new ConfirmEmailSuccess()),
            catchError(() => EMPTY)
        ))
    ));

     confirmEmailSuccess = createEffect(() => this.actions.pipe(
        ofType<ConfirmEmailSuccess>(ConfirmEmailTypes.CONFIRM_EMAIL_SUCCESS),
        mapTo(new SetSuccess(Messages.emailConfirmed))
    ));
}
