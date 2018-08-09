import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

declare var VERSION: any;

export function WINDOWFactory() {
    return (typeof window != "undefined") ? window : null;
}

export function isDevelopmentFactory() {
    return isDevMode();
}

export function VERSIONFactory() {
    return (typeof VERSION != "undefined") ? VERSION : 0;
}

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
        HttpClientModule
    ],
    exports: [
        CommonModule
    ],
    providers: [
        { provide: "isBrowser", useValue: null },
        { provide: "WINDOW", useFactory: (WINDOWFactory) },
        { provide: "isDevelopment", useFactory: (isDevelopmentFactory) },
        { provide: "VERSION", useFactory: (VERSIONFactory) }
    ]
})
export class AppSharedModule { }
