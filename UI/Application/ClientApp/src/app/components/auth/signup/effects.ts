import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { SetError, SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { AuthService } from '~/services/auth/auth.service';
import { filterError } from '~/utils/filter.error';
import { SignupRequest, SignupError, SignupSuccess } from './actions';
import { SignupTypes } from './types';

@Injectable()
export class SignupEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthService) private authService: AuthService,
        @Inject(Router) private router: Router,
    ) { }

    @Effect() signupRequest = this.actions.pipe(
        ofType<SignupRequest>(SignupTypes.SIGNUP_REQUEST),
        mergeMap(x => this.authService.signup(x.payload.value).pipe(
            tap(() => x.payload.reset()),
            mapTo(new SignupSuccess()),
            catchError(e => of(new SignupError(e.error)))
        ))
    );

    @Effect() signupSuccess = this.actions.pipe(
        ofType<SignupSuccess>(SignupTypes.SIGNUP_SUCCESS),
        tap(() => this.router.navigate(['/signin'])),
        mapTo(new SetSuccess(MessagesType.checkEmail))
    );

    @Effect() signupError = this.actions.pipe(
        ofType<SignupError>(SignupTypes.SIGNUP_ERROR),
        filter(filterError),
        map(e => new SetError(e.error))
    );
}