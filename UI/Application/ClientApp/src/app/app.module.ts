import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { AppSharedModule } from './app.shared.module';
import { AppComponent } from './components/app/app.component';
import { IS_BROWSER } from './tokens/is-browser.token';

@NgModule({
    imports: [BrowserAnimationsModule, AppSharedModule],
    providers: [
        { provide: IS_BROWSER, useValue: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }