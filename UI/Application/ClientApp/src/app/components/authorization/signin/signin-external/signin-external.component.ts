import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Inject, Input, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IToken } from '../../../../interfaces/token';
import { TokenService } from '../../../../services/token/token.service';
import { BASE_URL } from '../../../../tokens/base-url.token';

declare const window;

/** TODO: center the dialog */
/** TODO: test changes */
@Component({
    selector: 'signin-external',
    templateUrl: './signin-external.component.html',
    styleUrls: ['./signin-external.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninExternalComponent implements OnInit {

    @HostBinding('class.d-block') readonly dBlock = true;
    /** possible variants: facebook, google, twitter et. */
    @Input() provider: string;
    @Input() iconClass: string;
    providerWindow;

    constructor(
        @Inject(NgZone) private zone: NgZone,
        @Inject(Router) private router: Router,
        @Inject(BASE_URL) private baseUrl: string,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(TokenService) private tokenService: TokenService,
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {

            // close previously opened windows (if any)
            this.closeDialog();

            // instantiate the externalProviderLogin function
            // (if it doesn't exist already)
            if (!window.externalProviderLogin) {
                window.externalProviderLogin = this.signin;
            }
        }
    }

    private signin = (auth: IToken): void => {
        this.zone.run(() => {
            console.log('External Login successful!');
            this.tokenService.setToken(auth);
            this.router.navigate(['']);
        });
    }

    private closeDialog = (): void => {
        if (this.providerWindow) {
            this.providerWindow.close();
        }
        this.providerWindow = null;
    }

    submit = (provider: string): void => {
        if (isPlatformBrowser(this.platformId) && provider) {
            const url = `${this.baseUrl}/connect/token/external/${provider}`;

            // minimalistic mobile devices support
            const w = (screen.width >= 1050) ? 1050 : screen.width;
            const h = (screen.height >= 550) ? 550 : screen.height;
            const params = 'toolbar=yes,scrollbars=yes,resizable=yes,width=' + w + ', height=' + h;

            // close previously opened windows (if any)
            this.closeDialog();
            this.providerWindow = window.open(url, 'ExternalProvider', params, false);
        }
    }
}
