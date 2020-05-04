import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { NgxDropDirective } from './ngx-drop.directive';
import { NgxUploaderBaseDirective } from './ngx-uploader.base';

describe('NgxDropDirective', () => {

    let directive: NgxDropDirective;

    const elementRef = new ElementRef(null);
    let renderer: jasmine.SpyObj<Renderer2>;
    let event: jasmine.SpyObj<Event> & { [key: string]: any };
    const files = [];

    beforeEach(() => {
        event = jasmine.createSpyObj<Event>('Event', ['stopPropagation', 'preventDefault']);
        event.dataTransfer = { files };
        renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['removeClass', 'addClass']);
        directive = new NgxDropDirective(elementRef, renderer);
    });

    it('emitter instanceof NgxUploaderBaseDirective', () => {
        expect(directive instanceof NgxUploaderBaseDirective).toEqual(true);
    });
    it('dropClass', () => {
        expect(directive.dropClass).toEqual('drop');
    });
    it('emitter instanceof EventEmitter', () => {
        expect(directive.emitter instanceof EventEmitter).toEqual(true);
    });
    it('element', () => {
        expect(directive.element).toEqual(elementRef.nativeElement);
    });
    it('drop', () => {
        spyOn(directive, 'stopEvent');
        spyOn(directive, 'emit');
        directive.drop(event);
        expect(directive.stopEvent).toHaveBeenCalledWith(event);
        expect(renderer.removeClass).toHaveBeenCalledWith(directive.element, directive.dropClass);
        expect(directive.emit).toHaveBeenCalledWith(files);
    });
    it('dragenter', () => {
        spyOn(directive, 'stopEvent');
        directive.dragenter(event);
        expect(directive.stopEvent).toHaveBeenCalledWith(event);
        expect(renderer.addClass).toHaveBeenCalledWith(directive.element, directive.dropClass);
    });
    it('dragleave', () => {
        spyOn(directive, 'stopEvent');
        directive.dragleave(event);
        expect(directive.stopEvent).toHaveBeenCalledWith(event);
        expect(renderer.removeClass).toHaveBeenCalledWith(directive.element, directive.dropClass);
    });
    it('stopEvent', () => {
        directive.stopEvent(event);
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
    });
});
