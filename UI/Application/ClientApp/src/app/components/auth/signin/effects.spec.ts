import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { AuthService, IToken, TokenService } from '@renet-consulting/auth';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { NgxMessengerService } from '@renet-consulting/ngx-messenger';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetError } from '~/actions/messenger.actions';
import { ErrorCodeType } from '~/consts/error-code.type';
import { IError } from '~/interfaces/error';
import { IUser } from '~/interfaces/user';
import { SetAuthorized } from '../actions';
import { SigninError, SigninRequest, SigninSuccess, ExternalSignin } from './actions';
import { SigninEffects } from './effects';
import { ResendConfirmationComponent } from './resend-confirmation/resend-confirmation.component';

describe('SigninEffects', () => {

    let effects: SigninEffects;

    let actions: Observable<any>;
    let authService: jasmine.SpyObj<AuthService>;
    let tokenService: jasmine.SpyObj<TokenService>;
    let router: jasmine.SpyObj<Router>;
    let messengerService: jasmine.SpyObj<NgxMessengerService>;
    let metadata: EffectsMetadata<SigninEffects>;
    let params: jasmine.SpyObj<NgxHttpParamsService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SigninEffects,
                provideMockActions(() => actions),
                {
                    provide: AuthService,
                    useValue: jasmine.createSpyObj<AuthService>('AuthService', ['signin'])
                },
                { provide: TokenService, useValue: jasmine.createSpyObj<TokenService>('TokenService', ['setToken']) },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: NgxMessengerService, useValue: jasmine.createSpyObj<NgxMessengerService>('NgxMessengerService', ['error']) },
                { provide: NgxHttpParamsService, useValue: jasmine.createSpyObj<NgxHttpParamsService>('NgxHttpParamsService', ['map']) },
            ],
        });

        effects = TestBed.inject(SigninEffects);
        authService = TestBed.inject(AuthService as any);
        tokenService = TestBed.inject(TokenService as any);
        router = TestBed.inject(Router as any);
        messengerService = TestBed.inject(NgxMessengerService as any);
        params = TestBed.inject(NgxHttpParamsService as any);
        metadata = getEffectsMetadata(effects);

        params.map.and.returnValue(null);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('signinRequest', () => {

        let formGroup: FormGroup;
        let reset;
        let value: IUser;

        beforeEach(() => {
            reset = jasmine.createSpy();
            value = {} as IUser;
            formGroup = { reset, value } as FormGroup;
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
            expect(params.map).toHaveBeenCalled();
        });
        it('error', () => {
            const error = 'bob';
            authService.signin.and.returnValue(throwError(error));
            const action = new SigninRequest(formGroup);
            const completion = new SigninError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.signinRequest).toBeObservable(expected);
            expect(params.map).toHaveBeenCalled();
        });
    });

    it('signinSuccess', () => {
        const formGroup = {} as FormGroup;
        const token = {} as IToken;
        const action = new SigninSuccess(formGroup, token);
        const completion = new SetAuthorized({ authorized: true });
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.signinSuccess).toBeObservable(expected);
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
    it('externalSignin', () => {
        const provider = 'provider';
        const action = new ExternalSignin(provider);
        const completion = new SetAuthorized({ authorized: true, provider });
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.externalSignin).toBeObservable(expected);
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
            expect(metadata.signinError1001).toEqual({ dispatch: false, resubscribeOnError: true });
        });
    });

    it('navigate', () => {
        const formGroup = {} as FormGroup;
        const token = {} as IToken;
        const action = new SigninSuccess(formGroup, token);
        const completion = new SigninSuccess(formGroup, token);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.navigate).toBeObservable(expected);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
});
