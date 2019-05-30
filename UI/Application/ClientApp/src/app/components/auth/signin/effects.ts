import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { NgxMessengerService } from '@renet-consulting/ngx-messenger';
import { StorageService } from '@renet-consulting/storage';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { SetError } from '~/actions/messenger.actions';
import { ErrorCodeType } from '~/consts/error-code.type';
import { filterError } from '~/utils/filter.error';
import { SetAuthorized } from '../actions';
import { SigninError, SigninRequest, SigninSuccess } from './actions';
import { ResendConfirmationComponent } from './resend-confirmation/resend-confirmation.component';
import { SigninTypes } from './types';

@Injectable()
export class SigninEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthService) private authService: AuthService,
        @Inject(StorageService) private storageService: StorageService,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(Router) private router: Router,
        @Inject(NgxMessengerService) private messenger: NgxMessengerService,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
    ) { }

    @Effect() signinRequest = this.actions.pipe(
        ofType<SigninRequest>(SigninTypes.SIGNIN_REQUEST),
        mergeMap(a => this.authService.signin(a.payload.value, { params: this.params.map(a.payload.value.captcha) }).pipe(
            tap(() => this.storageService.setStorage(a.payload.value.isRemember)),
            tap(() => a.payload.reset()),
            map(i => new SigninSuccess(a.payload, i)),
            catchError(e => of(new SigninError(e.error)))
        ))
    );

    @Effect() signinSuccess = this.actions.pipe(
        ofType<SigninSuccess>(SigninTypes.SIGNIN_SUCCESS),
        tap(() => this.router.navigate(['/'])),
        tap(a => this.tokenService.setToken(a.success)),
        map(() => new SetAuthorized({ authorized: true}))
    );

    @Effect() signinError = this.actions.pipe(
        ofType<SigninError>(SigninTypes.SIGNIN_ERROR),
        filter(filterError),
        filter(e => e.error.code !== ErrorCodeType.unconfirmedEmail),
        map(e => new SetError(e.error))
    );

    @Effect({ dispatch: false }) signinError1001 = this.actions.pipe(
        ofType<SigninError>(SigninTypes.SIGNIN_ERROR),
        filter(filterError),
        filter(e => e.error.code === ErrorCodeType.unconfirmedEmail),
        tap(e => this.messenger.error(ResendConfirmationComponent).componentInstance.error = e.error.error_description)
    );
}