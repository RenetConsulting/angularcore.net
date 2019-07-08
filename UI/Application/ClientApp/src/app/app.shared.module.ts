import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule, ɵa as NgProgressInterceptor } from '@ngx-progressbar/http';
import { AuthDefaultOptions, AuthInterceptor, TokenService } from '@renet-consulting/auth';
import { ApiPrefixInterceptor, ExtractErrorInterceptor, NoneCacheInterceptor } from '@renet-consulting/interceptors';
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
import { ErrorInterceptor } from './interceptors/error/error.interceptor';
import { REDUCERS } from './reducers';
import { InitializerService } from './services/initializer/initializer.service';
import { BASE_URL } from './tokens/base-url.token';

const initializerFactory = (service: InitializerService) => () => service.initialize();

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            deps: [TokenService, NgxHttpParamsService, AuthDefaultOptions], multi: true
        },
        { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [Store], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ExtractErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, deps: [BASE_URL], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
        { provide: APP_INITIALIZER, useFactory: initializerFactory, deps: [InitializerService], multi: true },
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