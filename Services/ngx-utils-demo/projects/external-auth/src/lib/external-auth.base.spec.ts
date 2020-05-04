import { EventEmitter, Injector, NgZone, Renderer2, Directive } from '@angular/core';
import { ExternalTokenHandlerService } from 'external-auth/public-api';
import { Observable } from 'rxjs';
import { ExternalAuthBase } from './external-auth.base';

@Directive()
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
    let tokenHandler: jasmine.SpyObj<ExternalTokenHandlerService>;

    beforeEach(() => {
        injector = jasmine.createSpyObj<Injector>('Injector', ['get']);
        zone = jasmine.createSpyObj<NgZone>('NgZone', ['run']);
        renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['createElement', 'setAttribute', 'appendChild']);
        tokenHandler = jasmine.createSpyObj<ExternalTokenHandlerService>('ExternalTokenHandlerService', ['handle']);

        zone.run.and.callFake(fn => fn());
        // tslint:disable-next-line:deprecation
        injector.get.and.returnValues(zone, doc, renderer, {}, tokenHandler);

        base = new Test(injector);
    });

    it('class', () => {
        expect(base.class).toEqual('d-block');
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
        expect(renderer.appendChild).toHaveBeenCalledWith(doc.head, script);
    });
    it('getToken', () => {
        const provider = 'google';
        const access_token = 'bob';
        const obs = jasmine.createSpyObj<Observable<any>>('Observable', ['subscribe']);
        base.provider = provider;
        tokenHandler.handle.and.returnValue(obs);
        base.getToken(access_token);
        expect(tokenHandler.handle).toHaveBeenCalledWith(access_token, provider);
        // tslint:disable-next-line: deprecation
        expect(obs.subscribe).toHaveBeenCalledWith({
            next: base.handleSigned,
            error: base.handleError
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
