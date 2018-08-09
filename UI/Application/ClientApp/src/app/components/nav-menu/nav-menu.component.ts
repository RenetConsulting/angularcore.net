import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { TokenService } from "../../services/token/token.service";

@Component({
    selector: "app-nav-menu",
    templateUrl: "./nav-menu.component.html",
    styleUrls: ["./nav-menu.component.scss"]
})
export class NavMenuComponent {

    isExpanded = false;

    constructor(
        @Inject(Router) private router: Router,
        @Inject(TokenService) private tokenService: TokenService
    ) { }

    collapse = (): void => {
        this.isExpanded = false;
    }

    toggle = (): void => {
        this.isExpanded = !this.isExpanded;
    }

    signout = (): void => {
        this.tokenService.clean();
        this.router.navigate(["/sign-in"]);
    }
}
