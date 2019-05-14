import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NgxMessengerService } from '@renet-consulting/ngx-messenger';
import { StorageService } from '@renet-consulting/storage';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { SetError } from '~/actions/messenger.actions';
import { ErrorCodeType } from '~/consts/error-code.type';
import { AuthorizationService } from '~/services/authorization/authorization.service';
import { TokenService } from '~/services/token/token.service';
import { filterError } from '~/utils/filter.error';
import { SigninRequest, SigninError, SigninSuccess } from './actions';
import { ResendConfirmationComponent } from './resend-confirmation/resend-confirmation.component';
import { SigninTypes } from './types';

@Injectable()
export class SigninEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(StorageService) private storageService: StorageService,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(Router) private router: Router,
        @Inject(NgxMessengerService) private messenger: NgxMessengerService,
    ) { }

    @Effect() signinRequest = this.actions.pipe(
        ofType<SigninRequest>(SigninTypes.SIGNIN_REQUEST),
        mergeMap(x => this.authorizationService.signin(x.payload.value).pipe(
            tap(() => this.storageService.setStorage(x.payload.controls.isRemember.value)),
            tap(() => x.payload.reset()),
            map(i => new SigninSuccess(x.payload, i)),
            catchError(e => of(new SigninError(e.error)))
        ))
    );

    @Effect({ dispatch: false }) signinSuccess = this.actions.pipe(
        ofType<SigninSuccess>(SigninTypes.SIGNIN_SUCCESS),
        tap(() => this.router.navigate(['/'])),
        tap(x => this.tokenService.setToken(x.success)),
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