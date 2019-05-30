import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Inject, Input, NgZone, OnChanges, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { SetAuthorized } from '../../actions';

declare const window;
declare var FB: any;

@Component({
    selector: 'facebook-signin',
    templateUrl: './facebook-signin.component.html',
    styleUrls: ['./facebook-signin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacebookSigninComponent implements OnChanges {

    @HostBinding('class.d-block') readonly dBlock = true;
    @Input() provider: string;
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
        this.renderer.setAttribute(script, 'src', '//connect.facebook.net/en_US/sdk.js');
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
            FB.init({ appId: '', version: 'v3.3' });
            this.signin();
        });
    }

    signin = (): void =>
        typeof FB !== 'undefined' && FB.getLoginStatus(x => x.authResponse ? this.getToken(x.authResponse.accessToken) : this.fbSignin())

    fbSignin = (): void =>
        FB.login(z => z.authResponse ? this.zone.run(() => this.getToken(z.authResponse.accessToken)) : null)

    submit = (): void => {
        if (isPlatformBrowser(this.platformId)) {
            if (typeof FB === 'undefined') {
                this.addScript();
                this.setInit();
            }
            else {
                this.signin();
            }
        }
    }
}
