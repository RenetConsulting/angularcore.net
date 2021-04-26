import { EventEmitter, Renderer2 } from '@angular/core';
import { NgxSelectDirective } from './ngx-select.directive';
import { NgxUploaderBaseDirective } from './ngx-uploader.base';

describe('NgxSelectDirective', () => {

    let directive: NgxSelectDirective;

    let renderer: jasmine.SpyObj<Renderer2>;
    let element: jasmine.SpyObj<HTMLInputElement>;
    let unlisten: jasmine.Spy;
    const files: any = [];

    beforeEach(() => {
        renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['createElement', 'setAttribute', 'listen', 'removeAttribute']);
        element = jasmine.createSpyObj<HTMLInputElement>('HTMLInputElement', ['click']);
        element.files = files;
        unlisten = jasmine.createSpy();
        directive = new NgxSelectDirective(renderer);
    });

    it('emitter instanceof NgxUploaderBaseDirective', () => {
        expect(directive instanceof NgxUploaderBaseDirective).toEqual(true);
    });
    it('emitter instanceof EventEmitter', () => {
        expect(directive.emitter instanceof EventEmitter).toEqual(true);
    });
    it('ngOnChanges', () => {
        spyOn(directive, 'setAttributes');
        directive.ngOnChanges();
        expect(directive.setAttributes).toHaveBeenCalled();
    });
    it('ngOnInit', () => {
        spyOn(directive, 'setAttributes');
        renderer.createElement.and.returnValue(element);
        directive.ngOnInit();
        expect(renderer.createElement).toHaveBeenCalledWith('input');
        expect(renderer.setAttribute).toHaveBeenCalledWith(element, 'type', 'file');
        expect(directive.setAttributes).toHaveBeenCalled();
    });
    it('ngOnDestroy', () => {
        spyOn(directive, 'removeListen');
        directive.ngOnDestroy();
        expect(directive.removeListen).toHaveBeenCalled();
    });
    it('click', () => {
        spyOn(directive, 'removeListen');
        Object.defineProperty(directive, 'element', { get: () => element });
        renderer.listen.and.returnValue(unlisten);
        directive.click();
        expect(directive.removeListen).toHaveBeenCalled();
        expect(renderer.listen).toHaveBeenCalledWith(element, 'change', directive.uploadFiles);
        expect(element.click).toHaveBeenCalled();
        expect(directive.unlisten).toEqual(unlisten);
    });
    it('uploadFiles', () => {
        spyOn(directive, 'removeListen');
        spyOn(directive, 'emit');
        Object.defineProperty(directive, 'element', { get: () => element });
        directive.uploadFiles();
        expect(directive.emit).toHaveBeenCalledWith(files);
        expect(element.value).toEqual('');
        expect(directive.removeListen).toHaveBeenCalled();
    });
    describe('setAttributes', () => {
        beforeEach(() => {
            Object.defineProperty(directive, 'element', { get: () => element });
        });
        it('multiple === empty string', () => {
            Object.defineProperty(directive, 'multiple', { get: () => '' });
            directive.setAttributes();
            expect(renderer.setAttribute).toHaveBeenCalledWith(element, 'multiple', '');
        });
        it('multiple === true', () => {
            directive.multiple = true;
            directive.setAttributes();
            expect(renderer.setAttribute).toHaveBeenCalledWith(element, 'multiple', '');
        });
        it('multiple == false', () => {
            directive.setAttributes();
            expect(renderer.removeAttribute).toHaveBeenCalledWith(element, 'multiple');
        });
    });
    it('removeListen', () => {
        directive.unlisten = unlisten;
        directive.removeListen();
        expect(directive.unlisten).toHaveBeenCalled();
    });
});
