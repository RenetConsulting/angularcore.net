import { EventEmitter, Injector, NgZone, Renderer2 } from '@angular/core';
import { AuthService, IToken, TokenService } from '@renet-consulting/auth';
import { of, throwError } from 'rxjs';
import { ExternalAuthBase } from './external-auth.base';

class Test extends ExternalAuthBase {

    scriptUrl = 'bob';
    init: () => void;
    setInit: () => void;
    signin: () => void;
    submit: () => void;
    signout: () => void;
}

describe('ExternalAuthBase', () => {

    let base: ExternalAuthBase;

    const doc = { head: {} };
    let injector: jasmine.SpyObj<Injector>;
    let zone: jasmine.SpyObj<NgZone>;
    let renderer: jasmine.SpyObj<Renderer2>;
    let authService: jasmine.SpyObj<AuthService>;
    let tokenService: jasmine.SpyObj<TokenService>;

    beforeEach(() => {
        injector = jasmine.createSpyObj<Injector>('Injector', ['get']);
        zone = jasmine.createSpyObj<NgZone>('NgZone', ['run']);
        renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['createElement', 'setAttribute', 'appendChild']);
        authService = jasmine.createSpyObj<AuthService>('AuthService', ['getToken']);
        tokenService = jasmine.createSpyObj<TokenService>('TokenService', ['setToken']);

        zone.run.and.callFake(fn => fn());
        // tslint:disable-next-line:deprecation
        injector.get.and.returnValues(zone, doc, renderer, {}, authService, tokenService);

        base = new Test(injector);
    });

    it('signed', () => {
        expect(base.signed instanceof EventEmitter).toEqual(true);
    });
    it('signedError', () => {
        expect(base.signedError instanceof EventEmitter).toEqual(true);
    });
    it('signedError', () => {
        expect(base.signedError instanceof EventEmitter).toEqual(true);
    });
    it('addScript', () => {
        const script = { node: 0 };
        renderer.createElement.and.returnValue(script);
        base.addScript();
        expect(renderer.createElement).toHaveBeenCalledWith('script');
        expect(renderer.setAttribute).toHaveBeenCalledWith(script, 'src', base.scriptUrl);
        expect(renderer.setAttribute).toHaveBeenCalledWith(script, 'defer', '');
        expect(renderer.setAttribute).toHaveBeenCalledWith(script, 'async', '');
        expect(renderer.appendChild).toHaveBeenCalledWith(doc.head, script);
    });

    describe('getToken', () => {

        const provider = 'google';
        const access_token = 'bob';
        const token = { grant_type: 'external_identity_token', access_token, state: provider, scope: 'offline_access' };
        const result = {} as IToken;

        beforeEach(() => {
            base.provider = provider;
        });

        it('success', () => {
            spyOn(base.signed, 'emit');
            authService.getToken.and.returnValue(of(result));
            base.getToken(access_token);
            expect(authService.getToken).toHaveBeenCalledWith(token);
            expect(tokenService.setToken).toHaveBeenCalledWith(result);
            expect(base.signed.emit).toHaveBeenCalledWith(base.provider);
        });
        it('error', () => {
            const error = { error: provider };
            spyOn(base.signed, 'emit');
            spyOn(base.signedError, 'emit');
            authService.getToken.and.returnValue(throwError(error));
            base.getToken(access_token);
            expect(authService.getToken).toHaveBeenCalledWith(token);
            expect(tokenService.setToken).not.toHaveBeenCalled();
            expect(base.signed.emit).not.toHaveBeenCalled();
            expect(base.signedError.emit).toHaveBeenCalledWith(error);
        });
    });

    describe('handleError', () => {

        it('should call emit', () => {
            spyOn(base.signedError, 'emit');
            base.handleError(null);
            expect(base.signedError.emit).toHaveBeenCalled();
        });
        it('should call run', () => {
            base.handleError(null);
            expect(zone.run).toHaveBeenCalled();
        });
    });
});
