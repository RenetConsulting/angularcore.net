import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subscription } from 'rxjs';
import { IUser } from '~/interfaces/user';
import { RootStore } from '~/reducers';
import { ResendConfirmationRequest } from './actions';
import { ResendConfirmationComponent } from './resend-confirmation.component';

describe('ResendConfirmationComponent', () => {

    let component: ResendConfirmationComponent;

    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideMockStore({})
            ]
        });
        store = TestBed.get(Store);
        component = new ResendConfirmationComponent(store);
    });

    it('subscription', () => {
        expect(component.subscription instanceof Subscription).toEqual(true);
    });
    it('ngOnInit', () => {
        const email = 'bob';
        const user = { email } as IUser;
        store.setState({ signin: { user } });
        component.ngOnInit();
        expect(component.email).toEqual(email);
        component.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
    it('submit', () => {
        spyOn(store, 'dispatch');
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new ResendConfirmationRequest(component.email));
    });
});