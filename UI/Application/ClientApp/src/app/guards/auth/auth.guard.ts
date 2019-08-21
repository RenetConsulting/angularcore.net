import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { selectAuthorized } from '~/components/auth/selectors';
import { RootStore } from '~/reducers';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    canActivate() {
        return this.store.select(selectAuthorized).pipe(take(1));
    }
}
