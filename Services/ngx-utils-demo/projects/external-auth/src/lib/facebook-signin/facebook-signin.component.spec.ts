import { Injector } from '@angular/core';
import { FacebookSigninComponent } from './facebook-signin.component';

declare const window;

fdescribe('FacebookSigninComponent', () => {

    let component: FacebookSigninComponent;

    let injector: jasmine.SpyObj<Injector>;
    const url = 'bob';
    const authResponse = { accessToken: 'qwe-123' };
    let FB: { logout, init, login: jasmine.Spy, getLoginStatus: jasmine.Spy };

    beforeEach(() => {
        injector = jasmine.createSpyObj<Injector>('Injector', ['get']);
        FB = jasmine.createSpyObj('FB', ['logout', 'init', 'login', 'getLoginStatus']);

        // tslint:disable-next-line:deprecation
        injector.get.and.returnValues(null, null, null, 'browser', null, null);

        component = new FacebookSigninComponent(injector, url);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('version', () => {
        expect(component.version).toEqual('v3.3');
    });
    it('iconClass', () => {
        expect(component.iconClass).toEqual('fab fa-facebook-f');
    });
    it('provider', () => {
        expect(component.provider).toEqual('facebook');
    });
    it('label', () => {
        expect(component.label).toEqual('Continue with facebook');
    });


    describe('has FB', () => {

        beforeEach(() => {
            window.FB = FB;
        });

        it('setConfig', () => {
            spyOn(component, 'signin');
            component.init();
            expect(FB.init).toHaveBeenCalledWith({ appId: component.appId, version: component.version });
            expect(component.signin).toHaveBeenCalled();
        });
        it('fbSignin', () => {
            FB.login.and.callFake(fn => fn({ authResponse }));
            spyOn(component, 'getToken');
            component.fbSignin();
            expect(FB.login).toHaveBeenCalled();
            expect(component.getToken).toHaveBeenCalled();
        });

        describe('signin', () => {

            it('has a token', () => {
                FB.getLoginStatus.and.callFake(fn => fn({ authResponse }));
                spyOn(component, 'signout').and.callFake(fn => fn());
                spyOn(component, 'fbSignin');
                component.signin();
                expect(component.signout).toHaveBeenCalled();
                expect(component.fbSignin).toHaveBeenCalled();
            });
            it('doesn`t have a token', () => {
                FB.getLoginStatus.and.callFake(fn => fn({}));
                FB.login.and.callFake(fn => fn({ authResponse }));
                spyOn(component, 'getToken');
                component.signin();
                expect(component.getToken).toHaveBeenCalledWith(authResponse.accessToken);
            });
        });

        it('signout', () => {
            component.signout();
            expect(FB.logout).toHaveBeenCalled();
        });
    });

    it('setInit', () => {
        component.setInit();
        expect(window.fbAsyncInit).toEqual(component.init);
    });

    describe('submit', () => {

        it('doesn`t have gapi', () => {
            window.FB = undefined;
            spyOn(component, 'setInit');
            spyOn(component, 'addScript');
            component.submit();
            expect(component.setInit).toHaveBeenCalled();
            expect(component.addScript).toHaveBeenCalled();
        });
        it('has gapi', () => {
            window.FB = FB;
            spyOn(component, 'signin');
            component.submit();
            expect(component.signin).toHaveBeenCalled();
        });
    });
});

