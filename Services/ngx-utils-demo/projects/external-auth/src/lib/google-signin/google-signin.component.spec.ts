import { Injector, NgZone } from '@angular/core';
import { AuthService, IToken, TokenService } from '@renet-consulting/auth';
import { of } from 'rxjs';
import { GoogleSigninComponent } from './google-signin.component';

declare const window;

describe('GoogleSigninComponent', () => {

    let component: GoogleSigninComponent;

    let injector: jasmine.SpyObj<Injector>;
    const url = 'bob';
    const token = { id_token: 'qwe-123' };
    let client: { init: jasmine.Spy };
    let auth2: { getAuthInstance: jasmine.Spy };
    let load: jasmine.Spy;
    let gapi: { client: typeof client, auth2: typeof auth2, load: typeof load };
    let then: jasmine.Spy;
    let promise: { then: jasmine.Spy };
    let user: { getAuthResponse: jasmine.Spy };
    let currentUser: { listen: jasmine.Spy, get: jasmine.Spy };
    let grantOfflineAccess: jasmine.Spy;
    let signOut: jasmine.Spy;
    let zone: jasmine.SpyObj<NgZone>;
    let authService: jasmine.SpyObj<AuthService>;
    let tokenService: jasmine.SpyObj<TokenService>;

    beforeEach(() => {
        injector = jasmine.createSpyObj<Injector>('Injector', ['get']);
        client = jasmine.createSpyObj('client', ['init']);
        auth2 = jasmine.createSpyObj('auth2', ['getAuthInstance']);
        zone = jasmine.createSpyObj<NgZone>('NgZone', ['run']);
        authService = jasmine.createSpyObj<AuthService>('AuthService', ['getToken']);
        tokenService = jasmine.createSpyObj<TokenService>('TokenService', ['setToken']);

        load = jasmine.createSpy('load', () => null);
        gapi = { client, auth2, load };
        then = jasmine.createSpy('then', () => null);
        promise = { then };
        user = { getAuthResponse: jasmine.createSpy() };
        currentUser = { get: jasmine.createSpy(), listen: jasmine.createSpy() };
        grantOfflineAccess = jasmine.createSpy();
        signOut = jasmine.createSpy();

        // tslint:disable-next-line:deprecation
        injector.get.and.returnValues(zone, null, null, 'browser', authService, tokenService);
        user.getAuthResponse.and.returnValue(token);
        currentUser.get.and.returnValue(user);
        auth2.getAuthInstance.and.returnValue({ currentUser, grantOfflineAccess, signOut });
        zone.run.and.callFake(fn => fn());
        authService.getToken.and.returnValue(of({} as IToken));

        component = new GoogleSigninComponent(injector, url);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('scope', () => {
        expect(component.scope).toEqual('profile');
    });
    it('iconClass', () => {
        expect(component.iconClass).toEqual('fab fa-google');
    });
    it('provider', () => {
        expect(component.provider).toEqual('google');
    });
    it('label', () => {
        expect(component.label).toEqual('Continue with google');
    });
    it('apiName', () => {
        expect(component.apiName).toEqual('client:auth2');
    });

    describe('has gapi', () => {

        beforeEach(() => {
            window.gapi = gapi;
        });

        it('initSignin', () => {
            spyOn(component, 'setListener');
            spyOn(component, 'signin');
            component.initSignin();
            expect(component.setListener).toHaveBeenCalled();
            expect(component.signin).toHaveBeenCalled();
        });
        it('setConfig', () => {
            client.init.and.returnValue(promise);
            component.setConfig();
            expect(client.init).toHaveBeenCalledWith({ clientId: component.clientId, scope: component.scope });
            expect(promise.then).toHaveBeenCalledWith(component.initSignin);
        });
        it('setListener', () => {
            component.setListener();
            expect(auth2.getAuthInstance).toHaveBeenCalled();
            expect(currentUser.listen).toHaveBeenCalledWith(component.authListener);
        });
        it('signin', () => {
            component.signin();
            expect(auth2.getAuthInstance).toHaveBeenCalled();
            expect(grantOfflineAccess).toHaveBeenCalled();
        });
        it('signout', () => {
            component.signout();
            expect(signOut).toHaveBeenCalled();
        });
    });

    it('authListener', () => {
        spyOn(component, 'getToken');
        component.authListener(user);
        expect(user.getAuthResponse).toHaveBeenCalled();
        expect(component.getToken).toHaveBeenCalledWith(token.id_token);
    });
    it('setInit', () => {
        component.setInit();
        expect(window.gAsyncInit).toEqual(component.init);
    });

    describe('submit', () => {

        it('doesn`t have gapi', () => {
            window.gapi = undefined;
            spyOn(component, 'setInit');
            spyOn(component, 'addScript');
            component.submit();
            expect(component.setInit).toHaveBeenCalled();
            expect(component.addScript).toHaveBeenCalled();
        });
        it('has gapi', () => {
            window.gapi = gapi;
            spyOn(component, 'signin');
            component.submit();
            expect(component.signin).toHaveBeenCalled();
        });
    });

    it('should emit value each time when creates a new component', () => {

        let fn: () => void;
        const emit = () => fn();
        const setEmitter = (value: () => void) => fn = value;

        // test 1
        spyOn(component.signed, 'emit');
        component.ngOnChanges({ provider: {} });
        setEmitter(component.handleSigned);
        emit();
        expect(component.signed.emit).toHaveBeenCalled();

        // test 2
        component = new GoogleSigninComponent(injector, url);

        spyOn(component.signed, 'emit');
        component.ngOnChanges({ provider: {} });
        emit();
        expect(component.signed.emit).toHaveBeenCalled();

        // test 3
        component = new GoogleSigninComponent(injector, url);

        spyOn(component.signed, 'emit');
        component.ngOnChanges({ provider: {} });
        emit();
        expect(component.signed.emit).toHaveBeenCalled();
    });
});
