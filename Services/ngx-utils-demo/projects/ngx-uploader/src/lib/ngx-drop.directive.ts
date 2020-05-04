import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, Output, Renderer2 } from '@angular/core';
import { NgxUploaderBaseDirective } from './ngx-uploader.base';

@Directive({
    selector: '[ngx-drop]'
})
export class NgxDropDirective extends NgxUploaderBaseDirective {

    @Input() dropClass = 'drop';
    @Output('ngx-drop') readonly emitter = new EventEmitter<Array<File>>();

    constructor(
        @Inject(ElementRef) private elementRef: ElementRef,
        @Inject(Renderer2) private renderer: Renderer2
    ) {
        super();
    }

    get element() {
        return this.elementRef.nativeElement;
    }

    @HostListener('drop', ['$event']) drop = (e): void => {
        this.stopEvent(e);
        this.renderer.removeClass(this.element, this.dropClass);
        this.emit(e.dataTransfer.files);
    }

    @HostListener('dragover', ['$event'])
    @HostListener('dragenter', ['$event']) dragenter = (e): void => {
        this.stopEvent(e);
        this.renderer.addClass(this.element, this.dropClass);
    }

    @HostListener('dragleave', ['$event']) dragleave = (e): void => {
        this.stopEvent(e);
        this.renderer.removeClass(this.element, this.dropClass);
    }

    /** internal */
    stopEvent = (e): void => {
        e.stopPropagation();
        e.preventDefault();
    }
}
