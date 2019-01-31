import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injector, NgModule, Provider } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ROUTES } from "./app.routes";
import { AppSharedModule } from "./app.shared.module";
import { AppComponent } from "./components/app/app.component";
import { HomeComponent } from "./components/home/home.component";
import { MessagerModule } from "./components/messager/messager.module";
import { NavMenuComponent } from "./components/nav-menu/nav-menu.component";
import { ErrorInterceptor } from "./interceptors/error/error.interceptor";
import { HttpAuthorizationInterceptor } from "./interceptors/http.authorization/http.authorization.interceptor";
import { NoneCacheInterceptor } from "./interceptors/none.cache/none.cache.interceptor";
import { AuthorizationService } from "./services/authorization/authorization.service";
import { MessageHandlerService } from "./services/message.handler/message.handler.service";
import { StorageService } from "./services/storage/storage.service";
import { TokenService } from "./services/token/token.service";
import { ToolsService } from "./services/tools/tools.service";

const MODULES = [
    AppSharedModule,
    MessagerModule,
    RouterModule.forRoot(ROUTES)
]

const PROVIDERS: Array<Provider> = [
    AuthorizationService,
    StorageService,
    TokenService,
    ToolsService,
    MessageHandlerService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthorizationInterceptor, deps: [Injector], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [Injector], multi: true }
]

const COMPONENTS = [
    AppComponent,
    NavMenuComponent,
    HomeComponent
]

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
export class AppBaseModule { }
