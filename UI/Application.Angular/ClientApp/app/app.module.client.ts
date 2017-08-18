import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/components';
import { AppModule } from './app.module';

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

@NgModule({
	bootstrap: [AppComponent],
	imports: [
		BrowserModule.withServerTransition({ appId: 'appId' }),
		AppModule
	],
	providers: [
        { provide: 'ORIGIN_URL', useFactory: (getOriginUrl) },
		{ provide: 'isBrowser', useValue: true },
	]
})
export class AppModuleBrowser { }
