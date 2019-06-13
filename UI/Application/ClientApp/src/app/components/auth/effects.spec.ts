import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { AuthService, IToken, TokenService } from '@renet-consulting/auth';
import { StorageService } from '@renet-consulting/storage';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetSuccess } from '~/actions/messenger.actions';
import { Reset } from '~/actions/root.actions';
import { SetAuthorized, SignoutError, SignoutRequest, SignoutSuccess } from './actions';
import { AuthEffects } from './effects';

describe('AuthEffects', () => {

    let effects: AuthEffects;

    let actions: Observable<any>;
    let authService: jasmine.SpyObj<AuthService>;
    let tokenService: jasmine.SpyObj<TokenService>;
    let storageService: jasmine.SpyObj<StorageService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthEffects,
                provideMockActions(() => actions),
                {
                    provide: AuthService,
                    useValue: jasmine.createSpyObj<AuthService>('AuthService', ['signout'])
                },
                { provide: TokenService, useValue: jasmine.createSpyObj<TokenService>('TokenService', ['setToken', 'clean']) },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: StorageService, useValue: jasmine.createSpyObj<StorageService>('StorageService', ['get', 'set', 'remove']) },
            ],
        });

        effects = TestBed.get(AuthEffects);
        authService = TestBed.get(AuthService);
        tokenService = TestBed.get(TokenService);
        storageService = TestBed.get(StorageService);
        router = TestBed.get(Router);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('signoutRequest', () => {

        it('success', () => {
            const token = {} as IToken;
            authService.signout.and.returnValue(of(token));
            const action = new SignoutRequest();
            const completion = new SignoutSuccess();
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.signoutRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            authService.signout.and.returnValue(throwError({ error }));
            const action = new SignoutRequest();
            const completion = new SignoutError();
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.signoutRequest).toBeObservable(expected);
        });
    });

    it('signoutSuccess', () => {
        const action = new SignoutSuccess();
        const completionB = new SetSuccess('You has signed out successfully.');
        const completionC = new Reset();
        const expected = cold('--(bc)', { b: completionB, c: completionC });
        actions = hot('--a-', { a: action });
        expect(effects.signoutSuccess).toBeObservable(expected);
        expect(router.navigate).toHaveBeenCalledWith(['/signin']);
        expect(tokenService.clean).toHaveBeenCalled();
    });
    it('signoutError', () => {
        const action = new SignoutError();
        const expected = cold('--b', { b: action });
        actions = hot('--a-', { a: action });
        expect(effects.signoutError).toBeObservable(expected);
    });
    it('setAuthorized', () => {
        const provider = 'bob';
        const action = new SetAuthorized({ authorized: true, provider });
        const expected = cold('--b', { b: action });
        actions = hot('--a-', { a: action });
        expect(effects.setAuthorized).toBeObservable(expected);
        expect(storageService.set).toHaveBeenCalledWith(effects.providerKey, provider);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
    it('ngrxOnInitEffects', () => {
        const provider = 'bob';
        storageService.get.and.returnValue(provider);
        expect(effects.ngrxOnInitEffects()).toEqual(new SetAuthorized({ authorized: tokenService.valid, provider }));
        expect(storageService.get).toHaveBeenCalledWith(effects.providerKey);
    });
});