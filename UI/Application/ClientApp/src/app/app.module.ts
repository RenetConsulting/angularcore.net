import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSharedModule } from './app.shared.module';
import { AppComponent } from './components/app/app.component';
import { BASE_URL } from './tokens/base-url.token';
import { IS_BROWSER } from './tokens/is-browser.token';

const BASE_URL_FACTORY = () => {
    if (typeof window !== 'undefined') {
        /** IE bug fix */
        const port = window.location.port ? `:${window.location.port}` : '';
        return `${window.location.protocol}//${window.location.hostname}${port}`;
    }
    return '';
};

@NgModule({
    imports: [BrowserAnimationsModule, AppSharedModule],
    providers: [
        { provide: BASE_URL, useFactory: BASE_URL_FACTORY },
        { provide: IS_BROWSER, useValue: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }