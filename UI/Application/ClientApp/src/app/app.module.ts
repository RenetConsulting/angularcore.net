import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { AppBaseModule } from './app.base.module';
import { AppComponent } from './components/app/app.component';
import { BASE_URL } from './tokens/base.url';
import { IS_BROWSER } from './tokens/is.browser';
import { WINDOW } from './tokens/window';

const BASE_URL_FACTORY = (window): string => {
    let url: string = null;
    if (window) {
        url = window.location.protocol + '//' + window.location.hostname + ((window.location.port) ? ':' + window.location.port : '');
    }
    return url;
};

@NgModule({
    imports: [BrowserAnimationsModule, AppBaseModule],
    providers: [
        { provide: IS_BROWSER, useValue: true },
        { provide: BASE_URL, useFactory: (BASE_URL_FACTORY), deps: [WINDOW] }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }