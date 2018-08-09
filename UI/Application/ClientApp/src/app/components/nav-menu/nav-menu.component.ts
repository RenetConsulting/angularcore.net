import { Component } from "@angular/core";

@Component({
    selector: "app-nav-menu",
    templateUrl: "./nav-menu.component.html",
    styleUrls: ["./nav-menu.component.scss"]
})
export class NavMenuComponent {

    isExpanded = false;

    constructor() { }

    collapse = (): void => {
        this.isExpanded = false;
    }

    toggle = (): void => {
        this.isExpanded = !this.isExpanded;
    }
}
