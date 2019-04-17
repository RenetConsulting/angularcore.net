import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { BLOG_DEFAULT_OPTIONS } from 'projects/blog/src/public-api';
import { environment } from 'src/environments/environment';
import { ROUTES } from './app.routes';
import { AppComponent } from './components/app/app.component';
import { HeaderModule } from './components/header/header.module';
import { HomeComponent } from './components/home/home.component';
import { MessagerModule } from './components/messager/messager.module';
import { ThemeEffects } from './components/theme-picker/effects';
import { BLOG_OPTIONS } from './consts/blog-options';
import { AuthorizationEffects } from './effects/authorization.effects';
import { ApiPrefixInterceptor } from './interceptors/api-prefix/api-prefix.interceptor';
import { ErrorInterceptor } from './interceptors/error/error.interceptor';
import { HttpAuthorizationInterceptor } from './interceptors/http-authorization/http-authorization.interceptor';
import { NoneCacheInterceptor } from './interceptors/none-cache/none-cache.interceptor';
import { REDUCERS } from './reducers';
import { TokenService } from './services/token/token.service';
import { BASE_URL } from './tokens/base-url.token';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthorizationInterceptor, deps: [TokenService, NgxHttpParamsService], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [Store], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, deps: [BASE_URL], multi: true },
        { provide: BLOG_DEFAULT_OPTIONS, useValue: BLOG_OPTIONS },
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        CommonModule,
        HttpClientModule,
        RouterModule.forRoot(ROUTES),
        StoreModule.forRoot(REDUCERS, { metaReducers: environment.metaReducers }),
        EffectsModule.forRoot([AuthorizationEffects, ThemeEffects]),
        HeaderModule,
        MessagerModule,
    ],
})
export class AppSharedModule { }