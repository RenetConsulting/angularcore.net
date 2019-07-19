import { Injector, NgZone } from '@angular/core';
import { AuthService, IToken, TokenService } from '@renet-consulting/auth';
import { of } from 'rxjs';
import { GoogleSigninComponent } from './google-signin.component';
// /// <reference path="@types/gapi" />
// /// <reference path="@types/gapi.auth2" />

declare const window;

export interface ICurrentUser {
    listen: jasmine.Spy;
    get: jasmine.Spy;
}

describe('GoogleSigninComponent', () => {

    let component: GoogleSigninComponent;

    let injector: jasmine.SpyObj<Injector>;
    const url = 'bob';
    const token = { id_token: 'qwe-123' };
    let client: { init: jasmine.Spy };
    let auth2: { getAuthInstance: jasmine.Spy };
    let load: jasmine.Spy;
    let gapi: { client: typeof client, auth2: typeof auth2, load: typeof load };
    let promise: jasmine.SpyObj<Promise<any>>;
    let user: { getAuthResponse: jasmine.Spy };
    let currentUser: { listen: jasmine.Spy, get: jasmine.Spy };
    let grantOfflineAccess: jasmine.Spy;
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
        promise = jasmine.createSpyObj<Promise<any>>('Promise', ['then']);
        user = { getAuthResponse: jasmine.createSpy() };
        currentUser = jasmine.createSpyObj<ICurrentUser>('User', ['get', 'listen']);
        grantOfflineAccess = jasmine.createSpy();

        // tslint:disable-next-line:deprecation
        injector.get.and.returnValues(zone, null, null, 'browser', authService, tokenService);
        user.getAuthResponse.and.returnValue(token);
        currentUser.get.and.returnValue(user);
        auth2.getAuthInstance.and.returnValue({ currentUser, grantOfflineAccess });
        zone.run.and.callFake(fn => fn());
        authService.getToken.and.returnValue(of({} as IToken));

        component = new GoogleSigninComponent(injector, url);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('scope', () => {
        expect(component.scope).toEqual('openid');
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
            expect(promise.then).toHaveBeenCalledWith(component.initSignin, component.handleError);
        });
        it('setListener', () => {
            component.setListener();
            expect(auth2.getAuthInstance).toHaveBeenCalled();
            expect(currentUser.listen).toHaveBeenCalled();
        });
        it('signin', () => {
            grantOfflineAccess.and.returnValue(promise);
            component.signin();
            expect(auth2.getAuthInstance).toHaveBeenCalled();
            expect(grantOfflineAccess).toHaveBeenCalled();
            expect(promise.then).toHaveBeenCalledWith(null, component.handleError);
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

    it('should emit value for all components', () => {

        window.gapi = gapi;

        currentUser.listen.and.callFake(x => x());

        // test 1
        spyOn(component, 'authListener');
        component.ngOnInit();

        // test 2
        const comp1 = new GoogleSigninComponent(injector, url);
        spyOn(comp1, 'authListener');
        comp1.ngOnInit();

        // test 3
        const comp2 = new GoogleSigninComponent(injector, url);
        spyOn(comp2, 'authListener');
        comp2.ngOnInit();

        // test 4
        const comp3 = new GoogleSigninComponent(injector, url);
        spyOn(comp3, 'authListener');
        comp3.ngOnInit();
        comp3.ngOnDestroy();

        comp1.setListener();

        expect(component.authListener).toHaveBeenCalled();
        expect(comp1.authListener).toHaveBeenCalled();
        expect(comp2.authListener).toHaveBeenCalled();
        expect(comp3.authListener).not.toHaveBeenCalled();
    });
});
