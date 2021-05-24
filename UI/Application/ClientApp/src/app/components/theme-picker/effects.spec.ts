import { TestBed } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StorageService } from '@renet-consulting/storage';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { RootStore } from '~/reducers';
import { SetTheme } from './actions';
import { ThemeEffects } from './effects';
import { ITheme } from './theme';

describe('ThemeEffects', () => {

    let effects: ThemeEffects;

    let actions: Observable<any>;
    let store: MockStore<RootStore>;
    let storageService: jasmine.SpyObj<StorageService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ThemeEffects,
                provideMockActions(() => actions),
                provideMockStore({}),
                { provide: StorageService, useValue: jasmine.createSpyObj<StorageService>('StorageService', ['get', 'set']) },
            ],
        });

        effects = TestBed.inject(ThemeEffects);
        store = TestBed.inject(Store as any);
        storageService = TestBed.inject(StorageService as any);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('init', () => {

        beforeEach(() => {
            const action: Action = { type: ROOT_EFFECTS_INIT };
            actions = hot('--a-', { a: action });
        });

        it('has storage value', () => {
            const theme = {} as ITheme;
            store.setState({ theme: { items: [] } });
            storageService.get.and.returnValue(theme);
            const completion = new SetTheme(theme);
            const expected = cold('--b', { b: completion });
            expect(effects.init).toBeObservable(expected);
            expect(storageService.get).toHaveBeenCalled();
        });
        it('doesn`t have storage value', () => {
            const theme = { isDefault: true } as ITheme;
            store.setState({ theme: { items: [theme] } });
            storageService.get.and.returnValue(null);
            const completion = new SetTheme(theme);
            const expected = cold('--b', { b: completion });
            expect(effects.init).toBeObservable(expected);
            expect(storageService.get).toHaveBeenCalled();
        });
    });

    describe('setTheme', () => {

        it('delete', () => {
            const theme = { isDefault: true } as ITheme;
            const action = new SetTheme(theme);
            const expected = cold('--b', { b: theme });
            actions = hot('--a-', { a: action });
            expect(effects.setTheme).toBeObservable(expected);
            expect(storageService.set).toHaveBeenCalledWith(effects.key, theme);
        });
        it('delete', () => {
            const theme = { name: 'bob' } as ITheme;
            const action = new SetTheme(theme);
            const expected = cold('--b', { b: theme });
            actions = hot('--a-', { a: action });
            expect(effects.setTheme).toBeObservable(expected);
            expect(storageService.set).toHaveBeenCalledWith(effects.key, theme);
        });
    });
});