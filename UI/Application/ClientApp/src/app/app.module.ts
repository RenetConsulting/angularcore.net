import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed! 
import { AppBaseModule } from "./app.base.module";
import { AppComponent } from "./components/app/app.component";

export function BASE_URLFactory(): string {
    let url: string = null;
    if (typeof window != "undefined") {
        url = window.location.protocol + "//" + window.location.hostname + ((window.location.port) ? ":" + window.location.port : "");
    }
    return url;
};

@NgModule({
    imports: [
        BrowserAnimationsModule,
        AppBaseModule
    ],
    providers: [
        { provide: "isBrowser", useValue: true },
        { provide: "BASE_URL", useFactory: (BASE_URLFactory) }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
