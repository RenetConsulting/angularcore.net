import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, Output, Renderer2 } from '@angular/core';
import { FileError, FileOption } from './models';
import { emitOpload } from './utils';

@Directive({
    selector: '[ngx-drop]'
})
export class NgxDropDirective {

    @Input() accept: string;
    @Input() multiple: boolean;
    @Input() dropClass = 'drop';
    @Input() options: FileOption = {};
    @Output('ngx-drop') readonly emitter = new EventEmitter<File | File[] | FileError>();

    constructor(
        @Inject(ElementRef) private elm: ElementRef,
        @Inject(Renderer2) private render: Renderer2
    ) { }

    @HostListener('drop', ['$event'])  drop(e: any) {
        this.stopEvent(e);
        this.render.removeClass(this.elm.nativeElement, this.dropClass);

        this.emitter.emit(
            emitOpload(e.dataTransfer.files, this.accept, this.multiple, this.options)
        );
    }

    @HostListener('dragover', ['$event'])
    @HostListener('dragenter', ['$event'])  dragenter(e: any) {
        this.stopEvent(e);
        this.render.addClass(this.elm.nativeElement, this.dropClass);
    }

    @HostListener('dragleave', ['$event'])  dragleave(e: any) {
        this.stopEvent(e);
        this.render.removeClass(this.elm.nativeElement, this.dropClass);
    }

    stopEvent(e: any) {
        e.stopPropagation();
        e.preventDefault();
    }
}
