import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType, OnInitEffects } from '@ngrx/effects';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { StorageService } from '@renet-consulting/storage';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { SetSuccess } from '~/actions/messenger.actions';
import { Reset } from '~/actions/root.actions';
import { SetAuthorized, SignoutError, SignoutRequest, SignoutSuccess } from './actions';
import { AuthTypes } from './types';

@Injectable()
export class AuthEffects implements OnInitEffects {

    readonly providerKey = 'provider';

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthService) private authService: AuthService,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(StorageService) private storageService: StorageService,
        @Inject(Router) private router: Router,
    ) { }

    @Effect() signoutRequest = this.actions.pipe(
        ofType<SignoutRequest>(AuthTypes.SIGNOUT_REQUEST),
        mergeMap(() => this.authService.signout().pipe(
            map(() => new SignoutSuccess()),
            catchError(() => of(new SignoutError()))
        )),
    );

    @Effect() signoutSuccess = this.actions.pipe(
        ofType<SignoutSuccess>(AuthTypes.SIGNOUT_SUCCESS),
        tap(this.tokenService.clean),
        tap(() => this.storageService.remove(this.providerKey)),
        tap(() => this.router.navigate(['/signin'])),
        switchMap(() => [
            new SetSuccess('You has signed out successfully.'),
            new Reset()
        ]),
    );

    @Effect({ dispatch: false }) signoutError = this.actions.pipe(
        ofType<SignoutError>(AuthTypes.SIGNOUT_ERROR),
        tap(this.tokenService.clean),
    );

    @Effect({ dispatch: false }) setAuthorized = this.actions.pipe(
        ofType<SetAuthorized>(AuthTypes.SET_AUTHORIZED),
        tap(x => this.storageService.set(this.providerKey, x.payload.provider)),
    );

    ngrxOnInitEffects() {
        return new SetAuthorized({
            authorized: this.tokenService.valid,
            provider: this.storageService.get(this.providerKey)
        });
    }
}
