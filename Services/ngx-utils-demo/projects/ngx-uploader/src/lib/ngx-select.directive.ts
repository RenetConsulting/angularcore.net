import { AfterViewInit, Directive, EventEmitter, HostListener, Inject, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { FileError, FileOption } from './models';
import { emitOpload } from './utils';

@Directive({
    selector: '[ngx-select]',
})
export class NgxSelectDirective implements AfterViewInit, OnDestroy {

    @Input() accept: string;
    @Input() multiple: boolean;
    @Input() options: FileOption = {};
    @Output('ngx-select') readonly emitter = new EventEmitter<File | File[] | FileError>();
    private fileElm: HTMLInputElement;
    changeListen: () => void;

    constructor(
        @Inject(Renderer2) private render: Renderer2
    ) { }

    ngAfterViewInit(): void {
        if (!this.fileElm) {
            this.fileElm = this.render.createElement('input');
            this.render.setAttribute(this.fileElm, 'type', 'file');
        }
    }

    ngOnDestroy(): void {
        // remove listen
        this.removeListen();
    }

    @HostListener('click', ['$event']) click() {
        this.bindBeforeClick();

        this.fileElm.click();
    }

    private bindBeforeClick() {
        if (this.multiple) {
            this.render.setAttribute(this.fileElm, 'multiple', '');
        }
        else {
            this.render.removeAttribute(this.fileElm, 'multiple');
        }
        this.render.setAttribute(this.fileElm, 'accept', this.accept);
        this.removeListen();
        this.changeListen = this.render.listen(this.fileElm, 'change', () => {
            // when length is more than 0
            if (this.fileElm.files.length) {
                this.emitter.emit(
                    emitOpload(this.fileElm.files, this.accept, this.multiple, this.options)
                );
            }
            this.fileElm.value = '';
            this.changeListen();
        });
    }

    private removeListen() {
        if (this.changeListen) {
            this.changeListen();
        }
    }
}
