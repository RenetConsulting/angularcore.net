import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { AppComponent } from './components/app/app.component';
import { HeaderModule } from './components/header/header.module';
import { HomeComponent } from './components/home/home.component';
import { MessagerModule } from './components/messager/messager.module';
import { ApiPrefixInterceptor } from './interceptors/api-prefix/api-prefix.interceptor';
import { ErrorInterceptor } from './interceptors/error/error.interceptor';
import { HttpAuthorizationInterceptor } from './interceptors/http-authorization/http-authorization.interceptor';
import { NoneCacheInterceptor } from './interceptors/none-cache/none-cache.interceptor';

const MODULES = [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    HttpClientModule,
    MessagerModule,
    RouterModule.forRoot(ROUTES),
    HeaderModule
];

const PROVIDERS: Array<Provider> = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthorizationInterceptor, deps: [Injector], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [Injector], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, deps: [Injector], multi: true }
];

const COMPONENTS = [
    AppComponent,
    HomeComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    providers: [
        ...PROVIDERS
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class AppSharedModule { }