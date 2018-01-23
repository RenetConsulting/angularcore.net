import { NgModule } from '@angular/core';
import { AppComponent } from './components/components';
import { AppBaseModule } from './app.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'jquery';
import 'bootstrap';

export function originUrlFactory(): string {
    let url: string = null;
    if (typeof window != 'undefined') {
        url = window.location.origin
        if (url == null) {
            // fixed bug for IE9 support
            url = window.location.protocol + "//" + window.location.hostname + ((window.location.port) ? ':' + window.location.port : '')
        }
    }
    return url;
}

export function windowFactory() {
    if (typeof window != 'undefined') {
        return window;
    }
    return null;
}

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppBaseModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: 'ORIGIN_URL', useFactory: (originUrlFactory) },
        { provide: 'isBrowser', useValue: true },
        { provide: 'WINDOW', useFactory: (windowFactory) },
    ]
})
export class AppModule { }
