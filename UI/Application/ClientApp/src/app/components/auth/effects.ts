import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { StorageService } from '@renet-consulting/storage';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
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

     signoutRequest = createEffect(() => this.actions.pipe(
        ofType<SignoutRequest>(AuthTypes.SIGNOUT_REQUEST),
        mergeMap(() => this.authService.signout().pipe(
            map(() => new SignoutSuccess()),
            catchError(() => of(new SignoutError()))
        )),
    ));

     signoutSuccess = createEffect(() => this.actions.pipe(
        ofType<SignoutSuccess>(AuthTypes.SIGNOUT_SUCCESS),
        tap(this.tokenService.clean),
        tap(() => this.storageService.remove(this.providerKey)),
        tap(() => this.router.navigate(['/signin'])),
        switchMap(() => [
            new SetSuccess('You has signed out successfully.'),
            new Reset()
        ]),
    ));

     signoutError = createEffect(() => this.actions.pipe(
        ofType<SignoutError>(AuthTypes.SIGNOUT_ERROR),
        tap(this.tokenService.clean),
    ), { dispatch: false });

     setAuthorized = createEffect(() => this.actions.pipe(
        ofType<SetAuthorized>(AuthTypes.SET_AUTHORIZED),
        tap(x => this.storageService.set(this.providerKey, x.payload.provider)),
    ), { dispatch: false });

    ngrxOnInitEffects() {
        return new SetAuthorized({
            authorized: this.tokenService.valid,
            provider: this.storageService.get(this.providerKey)
        });
    }
}
