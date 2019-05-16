import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { NgxMessengerService } from '@renet-consulting/ngx-messenger';
import { StorageService } from '@renet-consulting/storage';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetError } from '~/actions/messenger.actions';
import { ErrorCodeType } from '~/consts/error-code.type';
import { IError } from '~/interfaces/error';
import { IToken } from '~/interfaces/token';
import { AuthService } from '~/services/auth/auth.service';
import { TokenService } from '~/services/token/token.service';
import { SetAuthorized } from '../actions';
import { SigninError, SigninRequest, SigninSuccess } from './actions';
import { SigninEffects } from './effects';
import { ResendConfirmationComponent } from './resend-confirmation/resend-confirmation.component';

describe('SigninEffects', () => {

    let effects: SigninEffects;

    let actions: Observable<any>;
    let authService: jasmine.SpyObj<AuthService>;
    let storageService: jasmine.SpyObj<StorageService>;
    let tokenService: jasmine.SpyObj<TokenService>;
    let router: jasmine.SpyObj<Router>;
    let messengerService: jasmine.SpyObj<NgxMessengerService>;
    let metadata: EffectsMetadata<SigninEffects>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SigninEffects,
                provideMockActions(() => actions),
                {
                    provide: AuthService,
                    useValue: jasmine.createSpyObj<AuthService>('AuthService', ['signin'])
                },
                { provide: StorageService, useValue: jasmine.createSpyObj<StorageService>('StorageService', ['setStorage']) },
                { provide: TokenService, useValue: jasmine.createSpyObj<TokenService>('TokenService', ['setToken']) },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: NgxMessengerService, useValue: jasmine.createSpyObj<NgxMessengerService>('NgxMessengerService', ['error']) },
            ],
        });

        effects = TestBed.get(SigninEffects);
        authService = TestBed.get(AuthService);
        storageService = TestBed.get(StorageService);
        tokenService = TestBed.get(TokenService);
        router = TestBed.get(Router);
        messengerService = TestBed.get(NgxMessengerService);
        metadata = getEffectsMetadata(effects);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });
    describe('signinRequest', () => {

        let formGroup: FormGroup;
        let reset;

        beforeEach(() => {
            reset = jasmine.createSpy();
            const isRemember = {} as AbstractControl;
            formGroup = { reset, controls: { isRemember } as { [k: string]: AbstractControl } } as FormGroup;
        });

        it('success', () => {
            const token = {} as IToken;
            authService.signin.and.returnValue(of(token));
            const action = new SigninRequest(formGroup);
            const completion = new SigninSuccess(formGroup, token);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.signinRequest).toBeObservable(expected);
            expect(reset).toHaveBeenCalled();
            expect(storageService.setStorage).toHaveBeenCalled();
        });
        it('error', () => {
            const error = 'bob';
            authService.signin.and.returnValue(throwError({ error }));
            const action = new SigninRequest(formGroup);
            const completion = new SigninError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.signinRequest).toBeObservable(expected);
        });
    });
    it('signinSuccess', () => {
        const formGroup = {} as FormGroup;
        const token = {} as IToken;
        const action = new SigninSuccess(formGroup, token);
        const completion = new SetAuthorized(true);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.signinSuccess).toBeObservable(expected);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        expect(tokenService.setToken).toHaveBeenCalledWith(token);
    });
    it('signinError', () => {
        const error = { error_description: 'bob error' } as IError;
        const action = new SigninError(error);
        const completion = new SetError(error);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.signinError).toBeObservable(expected);
    });
    describe('signinError1001', () => {

        it('should call methods', () => {
            messengerService.error.and.returnValue({ componentInstance: {} } as any);
            const error = { error_description: 'bob error', code: ErrorCodeType.unconfirmedEmail } as IError;
            const action = new SigninError(error);
            const expected = cold('--b', { b: action });
            actions = hot('--a-', { a: action });
            expect(effects.signinError1001).toBeObservable(expected);
            expect(messengerService.error).toHaveBeenCalledWith(ResendConfirmationComponent);
        });
        it('should have dispatch', () => {
            expect(metadata.signinError1001).toEqual({ dispatch: false });
        });
    });
});