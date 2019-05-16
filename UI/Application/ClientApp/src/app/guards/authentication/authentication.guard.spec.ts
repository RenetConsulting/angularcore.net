import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootStore } from '~/reducers';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {

    let guard: AuthenticationGuard;

    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.get(Store);
        guard = TestBed.get(AuthenticationGuard);
    });

    it('should toBeTruthy', () => {
        expect(guard).toBeTruthy();
    });
    it('canActivate', () => {
        store.setState({ auth: { authorized: true } });
        expect(guard).toBeTruthy();
    });
});
