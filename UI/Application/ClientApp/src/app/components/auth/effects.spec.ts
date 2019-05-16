import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetSuccess } from '~/actions/messenger.actions';
import { Reset } from '~/actions/root.actions';
import { IToken } from '~/interfaces/token';
import { AuthService } from '~/services/auth/auth.service';
import { TokenService } from '~/services/token/token.service';
import { SignoutError, SignoutRequest, SignoutSuccess } from './actions';
import { AuthEffects } from './effects';

fdescribe('AuthEffects', () => {

    let effects: AuthEffects;

    let actions: Observable<any>;
    let authService: jasmine.SpyObj<AuthService>;
    let tokenService: jasmine.SpyObj<TokenService>;
    let router: jasmine.SpyObj<Router>;
    let metadata: EffectsMetadata<AuthEffects>;

    metadata

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthEffects,
                provideMockActions(() => actions),
                {
                    provide: AuthService,
                    useValue: jasmine.createSpyObj<AuthService>('AuthService', ['signout'])
                },
                { provide: TokenService, useValue: jasmine.createSpyObj<TokenService>('TokenService', ['setToken']) },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
            ],
        });

        effects = TestBed.get(AuthEffects);
        authService = TestBed.get(AuthService);
        tokenService = TestBed.get(TokenService);
        router = TestBed.get(Router);
        metadata = getEffectsMetadata(effects);
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
    fit('signoutSuccess', () => {
        const token = {} as IToken;
        const action = new SignoutSuccess();
        const completionB = new SetSuccess('You has signed out successfully.');
        const completionC = new Reset();
        const expected = cold('--bc', { b: completionB, c: completionC });
        actions = hot('--a-', { a: action });
        expect(effects.signoutSuccess).toBeObservable(expected);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        expect(tokenService.setToken).toHaveBeenCalledWith(token);
    });
    it('signoutError', () => {
        const action = new SignoutError();
        const expected = cold('--b', { b: action });
        actions = hot('--a-', { a: action });
        expect(effects.signoutError).toBeObservable(expected);
    });
});