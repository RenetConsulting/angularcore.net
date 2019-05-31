import { DOCUMENT } from '@angular/common';
import { EventEmitter, HostBinding, Injector, Input, NgZone, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { AuthService, TokenService } from '@renet-consulting/auth';

export abstract class ExternalAuthBase {

    @HostBinding('class.d-block') readonly dBlock = true;
    @Input() provider: string;
    @Input() label: string;
    @Input() iconClass: string;
    @Output('onSignin') signinEmitter = new EventEmitter<string>();
    @Output('onError') signinErrorEmitter = new EventEmitter<any>();
    abstract scriptUrl: string;
    protected zone: NgZone;
    protected platformId: any;
    protected tokenService: TokenService;
    protected authService: AuthService;
    protected renderer: Renderer2;
    protected doc: any;

    constructor(
        injector: Injector
    ) {
        this.zone = injector.get(NgZone);
        this.platformId = injector.get(PLATFORM_ID);
        this.tokenService = injector.get(TokenService);
        this.authService = injector.get(AuthService);
        this.renderer = injector.get(Renderer2);
        this.doc = injector.get(DOCUMENT);
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
                this.signinEmitter.emit(this.provider);
            }, e => this.signinErrorEmitter.emit(e.error));
        })
    }
}