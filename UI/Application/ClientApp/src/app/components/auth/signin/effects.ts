import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { NgxMessengerService } from '@renet-consulting/ngx-messenger';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { SetError } from '~/actions/messenger.actions';
import { ErrorCodeType } from '~/consts/error-code.type';
import { filterError } from '~/utils/filter.error';
import { SetAuthorized } from '../actions';
import { ExternalSignin, SigninError, SigninRequest, SigninSuccess } from './actions';
import { ResendConfirmationComponent } from './resend-confirmation/resend-confirmation.component';
import { SigninTypes } from './types';

@Injectable()
export class SigninEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthService) private authService: AuthService,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(Router) private router: Router,
        @Inject(NgxMessengerService) private messenger: NgxMessengerService,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
    ) { }

     signinRequest = createEffect(() => this.actions.pipe(
        ofType<SigninRequest>(SigninTypes.SIGNIN_REQUEST),
        mergeMap(a => this.authService.signin(a.payload.value, { params: this.params.map(a.payload.value.captcha) }).pipe(
            tap(() => a.payload.reset()),
            map(i => new SigninSuccess(a.payload, i)),
            catchError(e => of(new SigninError(e)))
        ))
    ));

     signinSuccess = createEffect(() => this.actions.pipe(
        ofType<SigninSuccess>(SigninTypes.SIGNIN_SUCCESS),
        tap(a => this.tokenService.setToken(a.success)),
        map(() => new SetAuthorized({ authorized: true }))
    ));

     signinError = createEffect(() => this.actions.pipe(
        ofType<SigninError>(SigninTypes.SIGNIN_ERROR),
        filter(filterError),
        filter(e => e.error.code !== ErrorCodeType.unconfirmedEmail),
        map(e => new SetError(e.error))
    ));

     externalSignin = createEffect(() => this.actions.pipe(
        ofType<ExternalSignin>(SigninTypes.EXTERNAL_SIGNIN),
        map(a => new SetAuthorized({ authorized: true, provider: a.payload })),
    ));

     signinError1001 = createEffect(() => this.actions.pipe(
        ofType<SigninError>(SigninTypes.SIGNIN_ERROR),
        filter(filterError),
        filter(e => e.error.code === ErrorCodeType.unconfirmedEmail),
        tap(e => this.messenger.error(ResendConfirmationComponent).componentInstance.error = e.error.error_description)
    ), { dispatch: false });

     navigate = createEffect(() => this.actions.pipe(
        ofType<ExternalSignin | SigninSuccess>(SigninTypes.EXTERNAL_SIGNIN, SigninTypes.SIGNIN_SUCCESS),
        tap(() => this.router.navigate(['/'])),
    ), { dispatch: false });
}
