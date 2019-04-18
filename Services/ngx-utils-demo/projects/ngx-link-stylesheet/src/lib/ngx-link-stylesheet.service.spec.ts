import { DOCUMENT } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxLinkStylesheetService } from './ngx-link-stylesheet.service';

describe('NgxLinkStylesheetService', () => {

    let service: NgxLinkStylesheetService;

    let head: jasmine.SpyObj<HTMLHeadElement>;
    let element: jasmine.SpyObj<HTMLLinkElement>;
    let renderer2: jasmine.SpyObj<Renderer2>;
    let document: { head: typeof head };
    const href = 'https://';
    const className = 'some-theame';

    beforeEach(() => {
        element = jasmine.createSpyObj<HTMLLinkElement>('HTMLLinkElement', ['querySelector']);
        head = jasmine.createSpyObj<HTMLHeadElement>('HTMLHeadElement', ['querySelector']);
        document = { head };
        TestBed.configureTestingModule({
            providers: [
                { provide: DOCUMENT, useValue: document },
                {
                    provide: Renderer2, useValue: jasmine.createSpyObj<Renderer2>('Renderer2', [
                        'createElement',
                        'setAttribute',
                        'addClass',
                        'appendChild',
                        'removeChild'
                    ])
                }
            ]
        });
        service = TestBed.get(NgxLinkStylesheetService);
        renderer2 = TestBed.get(Renderer2);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('updateLink', () => {
        it('getLink', () => {
            head.querySelector.and.returnValue(element);
            service.updateLink(className, href);
            expect(head.querySelector).toHaveBeenCalledWith(`link[rel="stylesheet"].${className}`);
            expect(renderer2.setAttribute).toHaveBeenCalledWith(element, 'href', href)
        })
        it('createLink', () => {
            head.querySelector.and.returnValue(null);
            renderer2.createElement.and.returnValue(element);
            service.updateLink(className, href);
            expect(renderer2.createElement).toHaveBeenCalledWith('link');
            expect(renderer2.setAttribute).toHaveBeenCalledWith(element, 'rel', 'stylesheet');
            expect(renderer2.addClass).toHaveBeenCalledWith(element, className);
            expect(renderer2.appendChild).toHaveBeenCalledWith(head, element);
            expect(renderer2.setAttribute).toHaveBeenCalledWith(element, 'href', href)
        })
    })
    it('deleteLink', () => {
        head.querySelector.and.returnValue(element);
        service.deleteLink(className);
        expect(renderer2.removeChild).toHaveBeenCalledWith(head, element)
    })
});
