import { DOCUMENT } from '@angular/common';
import { EventEmitter, HostBinding, Injector, Input, NgZone, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { AuthService, TokenService } from '@renet-consulting/auth';

export abstract class ExternalAuthBase {

    @HostBinding('class.d-block') readonly dBlock = true;
    @Input() provider: string;
    @Input() label: string;
    @Input() iconClass: string;
    @Output() signed = new EventEmitter<string>();
    @Output() signedError = new EventEmitter<any>();
    abstract scriptUrl: string;
    protected zone: NgZone;
    protected doc: any;
    protected renderer: Renderer2;
    protected platformId: any;
    protected authService: AuthService;
    protected tokenService: TokenService;

    constructor(
        injector: Injector
    ) {
        this.zone = injector.get(NgZone);
        this.doc = injector.get(DOCUMENT);
        // tslint:disable-next-line:deprecation
        this.renderer = injector.get(Renderer2);
        this.platformId = injector.get(PLATFORM_ID);
        this.authService = injector.get(AuthService);
        this.tokenService = injector.get(TokenService);
    }

    abstract init: () => void;

    abstract setInit: () => void;

    abstract signin: () => void;

    abstract submit: () => void;

    addScript = (url = this.scriptUrl): void => {
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'src', url);
        this.renderer.setAttribute(script, 'defer', '');
        this.renderer.setAttribute(script, 'async', '');
        this.renderer.appendChild(this.doc.head, script);
    }

    getToken = (access_token: string): void => {
        this.zone.run(() => {
            const token = { grant_type: 'external_identity_token', access_token, state: this.provider, scope: 'offline_access' };
            this.authService.getToken(token).subscribe(x => {
                this.tokenService.setToken(x);
                this.signed.emit(this.provider);
            }, e => this.signedError.emit(e.error));
        });
    }
}