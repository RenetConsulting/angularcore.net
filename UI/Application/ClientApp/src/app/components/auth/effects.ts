import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType, OnInitEffects } from '@ngrx/effects';
import { TokenService } from '@renet-consulting/auth';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { SetSuccess } from '~/actions/messenger.actions';
import { Reset } from '~/actions/root.actions';
import { AuthService } from '@renet-consulting/auth';
import { SetAuthorized, SignoutError, SignoutRequest, SignoutSuccess } from './actions';
import { AuthTypes } from './types';

@Injectable()
export class AuthEffects implements OnInitEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthService) private authService: AuthService,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(Router) private router: Router,
    ) { }

    ngrxOnInitEffects() {
        return new SetAuthorized(this.tokenService.valid);
    }

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
}