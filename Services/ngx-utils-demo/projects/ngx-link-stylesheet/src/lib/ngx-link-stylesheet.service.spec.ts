import { DOCUMENT } from '@angular/common';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxLinkStylesheetService } from './ngx-link-stylesheet.service';

describe('NgxLinkStylesheetService', () => {

    let service: NgxLinkStylesheetService;

    let head: jasmine.SpyObj<HTMLHeadElement>;
    let element: jasmine.SpyObj<HTMLLinkElement>;
    let renderer: jasmine.SpyObj<Renderer2>;
    let rendererFactory: jasmine.SpyObj<RendererFactory2>;
    let document: { head: typeof head };
    const href = 'https://';
    const className = 'some-theame';

    beforeEach(() => {
        element = jasmine.createSpyObj<HTMLLinkElement>('HTMLLinkElement', ['querySelector']);
        head = jasmine.createSpyObj<HTMLHeadElement>('HTMLHeadElement', ['querySelector']);
        renderer = jasmine.createSpyObj<Renderer2>('Renderer2', [
            'createElement',
            'setAttribute',
            'addClass',
            'appendChild',
            'removeChild'
        ]);
        rendererFactory = jasmine.createSpyObj<RendererFactory2>('RendererFactory2', ['createRenderer']);
        rendererFactory.createRenderer.and.returnValue(renderer);
        document = { head };
        TestBed.configureTestingModule({
            providers: [
                { provide: DOCUMENT, useValue: document },
                { provide: RendererFactory2, useValue: rendererFactory }
            ]
        });
        service = TestBed.get(NgxLinkStylesheetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('update', () => {
        it('get', () => {
            head.querySelector.and.returnValue(element);
            service.update(className, href);
            expect(head.querySelector).toHaveBeenCalledWith(`link[rel="stylesheet"].${className}`);
            expect(renderer.setAttribute).toHaveBeenCalledWith(element, 'href', href);
        });
        it('update', () => {
            head.querySelector.and.returnValue(null);
            renderer.createElement.and.returnValue(element);
            service.update(className, href);
            expect(renderer.createElement).toHaveBeenCalledWith('link');
            expect(renderer.setAttribute).toHaveBeenCalledWith(element, 'rel', 'stylesheet');
            expect(renderer.addClass).toHaveBeenCalledWith(element, className);
            expect(renderer.appendChild).toHaveBeenCalledWith(head, element);
            expect(renderer.setAttribute).toHaveBeenCalledWith(element, 'href', href);
        });
    });
    it('delete', () => {
        head.querySelector.and.returnValue(element);
        service.delete(className);
        expect(renderer.removeChild).toHaveBeenCalledWith(head, element);
    });
});
