import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { AuthorizationService } from '../../../services/authorization/authorization.service';
import { StorageService } from '../../../services/storage/storage.service';
import { Signin, SigninError, SigninSuccess } from './actions';
import { SigninTypes } from './types';

@Injectable()
export class SigninEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(StorageService) private storageService: StorageService,
        @Inject(Router) private router: Router,
    ) { }

    @Effect() signin = this.actions.pipe(
        ofType<Signin>(SigninTypes.SIGNIN_REQUEST),
        mergeMap(x => this.authorizationService.signin(x.payload.value).pipe(
            tap(() => this.storageService.setStorage(x.payload.controls.isRemember.value)),
            tap(() => x.payload.reset()),
            mapTo(new SigninSuccess()),
            catchError(e => of(new SigninError(e.error)))
        ))
    );

    @Effect() signinSuccess = this.actions.pipe(
        ofType<SigninSuccess>(SigninTypes.SIGNIN_SUCCESS),
        tap(() => this.router.navigate(['/'])),
        mergeMap(() => EMPTY)
    );
}