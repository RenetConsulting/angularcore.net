import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken, NgModule } from '@angular/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxAModule } from 'projects/elements/src/lib/ngx-a/ngx-a.module';
import { ApiPrefixInterceptor, NoneCacheInterceptor } from 'projects/interceptors/src/public-api';
import { TitleStrategyModule } from 'projects/title-strategy/src/public-api';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

const BASE_URL = new InjectionToken('BASE_URL', {
    providedIn: 'root',
    factory: () => typeof window !== 'undefined' ? window.location.origin : ''
});

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(ROUTES),
        NgxAModule,
        TitleStrategyModule
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } as MatFormFieldDefaultOptions },
        { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, deps: [BASE_URL], multi: true },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule { }
