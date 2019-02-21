import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../services/authorization/authorization.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    expanded = false;

    constructor(
        @Inject(Router) private router: Router,
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
    ) { }

    collapse = (): void => {
        this.expanded = false;
    }

    toggle = (): void => {
        this.expanded = !this.expanded;
    }

    signout = (): void => {
        this.authorizationService.signout()
            .subscribe(() => this.router.navigate(['/sign-in']));
    }

    get isAuthenticated(): boolean {
        return this.authorizationService.isAuthenticated;
    }
}
