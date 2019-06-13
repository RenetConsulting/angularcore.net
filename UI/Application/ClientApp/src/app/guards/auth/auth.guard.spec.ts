import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { RootStore } from '~/reducers';
import { AuthGuard } from './auth.guard';

describe('AuthenticationGuard', () => {

    let guard: AuthGuard;

    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.get(Store);
        guard = TestBed.get(AuthGuard);
    });

    it('should toBeTruthy', () => {
        expect(guard).toBeTruthy();
    });
    it('canActivate', () => {
        store.setState({ auth: { authorized: true } });
        const completion = true;
        const expected = hot('(b|)', { b: completion });
        expect(guard.canActivate()).toBeObservable(expected);
    });
});
