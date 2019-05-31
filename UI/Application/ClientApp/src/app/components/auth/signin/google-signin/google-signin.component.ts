import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, HostBinding, Inject, Input, NgZone, OnChanges, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { SetAuthorized } from '../../actions';

declare const window;
declare var gapi: any;

@Component({
    selector: 'google-signin',
    templateUrl: './google-signin.component.html',
    styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent implements OnChanges {

    @HostBinding('class.d-block') readonly dBlock = true;
    @Input() provider: string;
    @Input() clientId: string;
    @Input() label: string;
    @Input() iconClass: string;

    constructor(
        @Inject(NgZone) private zone: NgZone,
        @Inject(Router) private router: Router,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(AuthService) private authService: AuthService,
        @Inject(Store) private store: Store<null>,
        @Inject(Renderer2) private renderer: Renderer2,
        @Inject(DOCUMENT) private doc: any,
    ) { }

    ngOnChanges(): void {
        this.label = this.label ? this.label : this.provider ? this.provider : null;
    }

    addScript = (): void => {
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'src', '//apis.google.com/js/api.js?onload=fbAsyncInit');
        this.renderer.setAttribute(script, 'defer', '');
        this.renderer.setAttribute(script, 'async', '');
        this.renderer.appendChild(this.doc.head, script);
    }

    getToken = (access_token: string): void => {
        this.authService.getToken({ grant_type: 'external_identity_token', access_token, state: this.provider, scope: 'offline_access' } as any).subscribe(x => {
            this.tokenService.setToken(x);
            this.store.dispatch(new SetAuthorized({ authorized: true, provider: this.provider }));
            this.router.navigate(['']);
        });
    }

    setInit = (): void => {
        window.fbAsyncInit = () => this.zone.run(() => {
            gapi.load('client:auth2', () => {
                gapi.client.init({ clientId: this.clientId, scope: 'profile' }).then(() => {
                    console.log('setInit')
                    this.signin();
                })
            });
        });
    }

    signin = (): void =>
        typeof gapi !== 'undefined' && this.zone.run(() => this.fbSignin())

    /** TODO: fix a bug when a user logins first time */
    fbSignin = (): void => {
        const auth = gapi.auth2.getAuthInstance();
        auth.grantOfflineAccess().then(() => {
            const token = auth.currentUser.get().getAuthResponse();
            console.log('auth.grantOfflineAccess()', auth, token,  'bob')
            if (token && token.id_token) {
                this.getToken(token.id_token)
            }
        })
    }

    submit = (): void => {
        if (isPlatformBrowser(this.platformId)) {
            if (typeof gapi === 'undefined') {
                this.addScript();
                this.setInit();
            }
            else {
                this.signin();
            }
        }
    }
}
