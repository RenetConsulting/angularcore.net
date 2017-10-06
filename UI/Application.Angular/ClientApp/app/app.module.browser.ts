import { NgModule } from '@angular/core';
import { AppComponent } from './components/components';
import { AppModule } from './app.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'jquery';
import 'bootstrap';

export function getOriginUrl(): string {
    let url: string = '/';
    if (typeof window != 'undefined') {
        // IE9 support
        url = window.location.protocol + "//" + window.location.hostname + ((window.location.port) ? ':' + window.location.port : '');
    }
    return url;
}

export function getWindow() {
    if (typeof window != 'undefined') {
        return window;
    }
    return null;
}

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: 'ORIGIN_URL', useFactory: (getOriginUrl) },
        { provide: 'isBrowser', useValue: true },
        { provide: 'WINDOW', useFactory: (getWindow) },
    ]
})
export class AppModuleBrowser { }
