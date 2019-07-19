import { DOCUMENT } from '@angular/common';
import { EventEmitter, HostBinding, Injector, Input, NgZone, OnDestroy, OnInit, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { Subscription } from 'rxjs';

export abstract class ExternalAuthBase<ErrorType = any> implements OnInit, OnDestroy {

    @HostBinding('class.d-block') readonly dBlock = true;
    @Input() provider: string;
    @Input() label: string;
    @Input() iconClass: string;
    @Output() signed = new EventEmitter<string>();
    @Output() signedError = new EventEmitter<ErrorType | any>();
    readonly subscription = new Subscription();
    abstract scriptUrl: string;
    abstract init: () => void;
    abstract setInit: () => void;
    abstract signin: () => void;
    abstract signout: () => void;
    abstract submit: () => void;
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

    ngOnInit(): void {
        this.subscription.add(this.signedError.subscribe(this.signout));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

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
                this.handleSigned();
            }, this.handleError);
        });
    }

    handleSigned = () => this.signed.emit(this.provider);

    handleError = (e: ErrorType | any) => this.zone.run(() => this.signedError.emit(e));
}
