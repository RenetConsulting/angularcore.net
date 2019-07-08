import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { SetError, SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { AccountService } from '~/services/account/account.service';
import { filterError } from '~/utils/filter.error';
import { ChangePasswordError, ChangePasswordRequest, ChangePasswordSuccess } from './actions';
import { ChangePasswordTypes } from './types';

@Injectable()
export class ChangePasswordEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AccountService) private accountService: AccountService,
    ) { }

    @Effect() changePasswordRequest = this.actions.pipe(
        ofType<ChangePasswordRequest>(ChangePasswordTypes.CHANGE_PASSWORD_REQUEST),
        mergeMap(x => this.accountService.changePassword(x.payload.value).pipe(
            tap(() => x.payload.reset()),
            mapTo(new ChangePasswordSuccess()),
            catchError(e => of(new ChangePasswordError(e)))
        ))
    );

    @Effect() changePasswordSuccess = this.actions.pipe(
        ofType<ChangePasswordSuccess>(ChangePasswordTypes.CHANGE_PASSWORD_SUCCESS),
        mapTo(new SetSuccess(MessagesType.passwordHasChanged))
    );

    @Effect() changePasswordError = this.actions.pipe(
        ofType<ChangePasswordError>(ChangePasswordTypes.CHANGE_PASSWORD_ERROR),
        filter(filterError),
        map(e => new SetError(e.error))
    );
}