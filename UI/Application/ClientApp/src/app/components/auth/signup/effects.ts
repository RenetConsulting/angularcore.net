import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '@renet-consulting/auth';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { SetError, SetSuccess } from '~/actions/messenger.actions';
import { Messages } from '~/consts/messages';
import { filterError } from '~/utils/filter.error';
import { SignupError, SignupRequest, SignupSuccess } from './actions';
import { SignupTypes } from './types';

@Injectable()
export class SignupEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthService) private authService: AuthService,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
        @Inject(Router) private router: Router,
    ) { }

     signupRequest = createEffect(() => this.actions.pipe(
        ofType<SignupRequest>(SignupTypes.SIGNUP_REQUEST),
        mergeMap(a => this.authService.signup(a.payload.value, { params: this.params.map(a.payload.value.captcha) }).pipe(
            tap(() => a.payload.reset()),
            mapTo(new SignupSuccess()),
            catchError(e => of(new SignupError(e)))
        ))
    ));

     signupSuccess = createEffect(() => this.actions.pipe(
        ofType<SignupSuccess>(SignupTypes.SIGNUP_SUCCESS),
        tap(() => this.router.navigate(['/signin'])),
        mapTo(new SetSuccess(Messages.checkEmail))
    ));

     signupError = createEffect(() => this.actions.pipe(
        ofType<SignupError>(SignupTypes.SIGNUP_ERROR),
        filter(filterError),
        map(e => new SetError(e.error))
    ));
}
