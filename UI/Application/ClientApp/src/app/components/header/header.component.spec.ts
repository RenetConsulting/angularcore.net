import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootStore } from '~/reducers';
import { SignoutRequest } from '../auth/actions';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {

    let component: HeaderComponent;

    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideMockStore({}),
            ]
        });
        store = TestBed.inject(Store as any);
        component = new HeaderComponent(store);
    });

    it('collapse', () => {
        component.collapse();
        expect(component.expanded).toEqual(false);
    });
    it('toggle', () => {
        component.toggle();
        expect(component.expanded).toEqual(true);
    });
    it('signout', () => {
        spyOn(store, 'dispatch');
        component.signout();
        expect(store.dispatch).toHaveBeenCalledWith(new SignoutRequest());
    });
});
