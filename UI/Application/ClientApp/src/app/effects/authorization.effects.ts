import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Signout } from '../actions/authorization.actions';
import { MessageRequest } from '../actions/message.actions';
import { AuthorizationService } from '../services/authorization/authorization.service';
import { TokenService } from '../services/token/token.service';
import { AuthorizationTypes } from '../types/authorization.types';

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
            map(() => new MessageRequest('Signout successfuly.')),
            catchError(() => EMPTY)
        ))
    );
}