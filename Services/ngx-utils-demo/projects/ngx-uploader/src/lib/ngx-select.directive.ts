import { Directive, EventEmitter, HostListener, Inject, OnChanges, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { isString } from '@renet-consulting/util';
import { NgxUploaderBase } from './ngx-uploader.base';

@Directive({
    selector: '[ngx-select]',
})
export class NgxSelectDirective extends NgxUploaderBase implements OnChanges, OnInit, OnDestroy {

    @Output('ngx-select') readonly emitter = new EventEmitter<Array<File>>();
    private element: HTMLInputElement;
    unlisten: () => void;

    constructor(
        @Inject(Renderer2) private renderer: Renderer2
    ) {
        super();
    }

    ngOnChanges(): void {
        this.setAttributes();
    }

    ngOnInit(): void {
        this.element = this.renderer.createElement('input');
        this.renderer.setAttribute(this.element, 'type', 'file');
        this.setAttributes();
    }

    ngOnDestroy(): void {
        this.removeListen();
    }

    @HostListener('click') click = (): void => {
        this.removeListen();
        this.unlisten = this.renderer.listen(this.element, 'change', this.uploadFiles);
        this.element.click();
    }

    /** internal */
    uploadFiles = (): void => {
        this.emit(this.element.files);
        this.element.value = '';
        this.removeListen();
    }

    /** internal */
    setAttributes = (): void => {
        if (this.element) {
            this.renderer.setAttribute(this.element, 'accept', this.accept);
            if (this.multiple || isString(this.multiple)) {
                this.renderer.setAttribute(this.element, 'multiple', '');
            }
            else {
                this.renderer.removeAttribute(this.element, 'multiple');
            }
        }
    }

    /** internal */
    removeListen = (): void => this.unlisten && this.unlisten();
}
