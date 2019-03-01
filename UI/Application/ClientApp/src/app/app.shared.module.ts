import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { ROUTES } from './app.routes';
import { AccountModule } from './components/account/account.module';
import { AppComponent } from './components/app/app.component';
import { AuthorizationModule } from './components/authorization/authorization.module';
import { HeaderModule } from './components/header/header.module';
import { HomeComponent } from './components/home/home.component';
import { MessagerModule } from './components/messager/messager.module';
import { AuthorizationEffects } from './effects/authorization.effects';
import { ApiPrefixInterceptor } from './interceptors/api-prefix/api-prefix.interceptor';
import { ErrorInterceptor } from './interceptors/error/error.interceptor';
import { HttpAuthorizationInterceptor } from './interceptors/http-authorization/http-authorization.interceptor';
import { NoneCacheInterceptor } from './interceptors/none-cache/none-cache.interceptor';
import { metaReducers, REDUCERS } from './reducers';
import { TokenService } from './services/token/token.service';
import { ToolsService } from './services/tools/tools.service';
import { BASE_URL } from './tokens/base-url.token';

const MODULES = [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(REDUCERS, { metaReducers }),
    EffectsModule.forRoot([AuthorizationEffects]),
    HeaderModule,
    MessagerModule,
    AccountModule,
    AuthorizationModule,
];

const PROVIDERS: Array<Provider> = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthorizationInterceptor, deps: [TokenService, ToolsService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [Store], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, deps: [BASE_URL], multi: true }
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