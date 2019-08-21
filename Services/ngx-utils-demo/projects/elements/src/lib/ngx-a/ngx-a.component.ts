import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';

/** cant use {@link routerLink} until fix https://github.com/angular/angular/issues/30207 */
/** has an issue when the component destroys itself https://github.com/angular/angular/issues/29606 */
@Component({
    selector: 'lib-ngx-a',
    templateUrl: './ngx-a.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxAComponent {

    @Input() href: any[] | string;

    constructor(
        @Inject(Router) private router: Router,
    ) { }

    /** TODO: remove after 30207 */
    onClick = (e): void => {
        e.preventDefault();
        this.router.navigateByUrl(Array.isArray(this.href) ? this.href.join('/') : this.href);
    }
}
