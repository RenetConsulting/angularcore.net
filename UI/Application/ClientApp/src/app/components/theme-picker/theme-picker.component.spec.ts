import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootStore } from '~/reducers';
import { SetTheme } from './actions';
import { ITheme } from './theme';
import { ThemePickerComponent } from './theme-picker.component';

describe('ThemePickerComponent', () => {

    let component: ThemePickerComponent;

    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.get(Store);
        component = new ThemePickerComponent(store);
    });

    it('select', () => {
        spyOn(store, 'dispatch');
        const item = {} as ITheme;
        component.select(item);
        expect(component).toBeTruthy();
        expect(store.dispatch).toHaveBeenCalledWith(new SetTheme(item));
    });
});
