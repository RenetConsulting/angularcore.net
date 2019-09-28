import { DOCUMENT } from '@angular/common';
import { EventEmitter, HostBinding, Injector, Input, NgZone, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ExternalTokenHandlerService } from './external-token-handler.service';

export abstract class ExternalAuthBase<ErrorType = any> {

    @HostBinding('class') readonly class = 'd-block';
    @Input() provider: string;
    @Input() label: string;
    @Input() iconClass: string;
    @Output() signed = new EventEmitter<string>();
    @Output() signedError = new EventEmitter<ErrorType | any>();
    abstract scriptUrl: string;
    abstract init: () => void;
    abstract setInit: () => void;
    abstract signin: () => void;
    abstract submit: () => void;
    protected zone: NgZone;
    protected doc: any;
    protected renderer: Renderer2;
    protected platformId: any;
    protected tokenHandler: ExternalTokenHandlerService;

    constructor(
        injector: Injector
    ) {
        this.zone = injector.get(NgZone);
        this.doc = injector.get(DOCUMENT);
        // tslint:disable-next-line:deprecation
        this.renderer = injector.get(Renderer2);
        this.platformId = injector.get(PLATFORM_ID);
        this.tokenHandler = injector.get(ExternalTokenHandlerService);
    }

    addScript = (url = this.scriptUrl): void => {
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'src', url);
        this.renderer.setAttribute(script, 'defer', '');
        this.renderer.appendChild(this.doc.head, script);
    }

    getToken = (access_token: string): void => {
        this.zone.run(() => {
            this.tokenHandler.handle(access_token, this.provider).subscribe({
                next: this.handleSigned,
                error: this.handleError
            });
        });
    }

    handleSigned = () => this.signed.emit(this.provider);

    handleError = (e: ErrorType | any) => this.zone.run(() => this.signedError.emit(e));
}
