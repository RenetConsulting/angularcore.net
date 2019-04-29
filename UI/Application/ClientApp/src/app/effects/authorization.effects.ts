import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Reset } from '~/actions/root.actions';
import { Signout } from '~/components/authorization/actions';
import { AuthorizationTypes } from '~/components/authorization/types';
import { SetSuccess } from '../actions/message.actions';
import { AuthorizationService } from '../services/authorization/authorization.service';
import { TokenService } from '../services/token/token.service';

@Injectable()
export class AuthorizationEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(Router) private router: Router,
    ) { }

    @Effect() signout = this.actions.pipe(
        ofType<Signout>(AuthorizationTypes.SIGNOUT),
        mergeMap(() => this.authorizationService.signout().pipe(
            tap(this.tokenService.clean),
            tap(() => this.router.navigate(['/signin'])),
            switchMap(() => [
                new SetSuccess('You has signed out successfully.'),
                new Reset()
            ]),
            catchError(() => EMPTY)
        )),
    );
}