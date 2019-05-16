import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule, ɵa as NgProgressInterceptor } from '@ngx-progressbar/http';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { NgxMessengerModule } from '@renet-consulting/ngx-messenger';
import { environment } from 'src/environments/environment';
import { ROUTES } from './app.routes';
import { AppComponent } from './components/app/app.component';
import { AuthEffects } from './components/auth/effects';
import { HeaderModule } from './components/header/header.module';
import { HomeComponent } from './components/home/home.component';
import { ThemeEffects } from './components/theme-picker/effects';
import { MessengerEffects } from './effects/messenger.effects';
import { ApiPrefixInterceptor } from './interceptors/api-prefix/api-prefix.interceptor';
import { ErrorInterceptor } from './interceptors/error/error.interceptor';
import { HttpAuthInterceptor } from './interceptors/http-auth/http-auth.interceptor';
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
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, deps: [TokenService, NgxHttpParamsService], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [Store], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, deps: [BASE_URL], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        CommonModule,
        HttpClientModule,
        RouterModule.forRoot(ROUTES),
        StoreModule.forRoot(REDUCERS, { metaReducers: environment.metaReducers }),
        EffectsModule.forRoot([AuthEffects, ThemeEffects, MessengerEffects]),
        HeaderModule,
        NgxMessengerModule,
        NgProgressModule,
        NgProgressHttpModule
    ],
})
export class AppSharedModule { }