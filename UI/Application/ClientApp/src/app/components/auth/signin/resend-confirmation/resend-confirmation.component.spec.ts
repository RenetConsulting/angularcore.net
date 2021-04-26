import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootStore } from '~/reducers';
import { ResendConfirmationRequest } from './actions';
import { ResendConfirmationComponent } from './resend-confirmation.component';

describe('ResendConfirmationComponent', () => {

    let component: ResendConfirmationComponent;

    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.inject(Store as any);
        component = new ResendConfirmationComponent(store);
    });

    it('submit', () => {
        spyOn(store, 'dispatch');
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new ResendConfirmationRequest());
    });
});