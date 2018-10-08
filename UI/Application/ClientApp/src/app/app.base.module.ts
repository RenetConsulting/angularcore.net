import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injector, NgModule, Provider } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { ROUTES } from "./app.routes";
import { AppSharedModule } from "./app.shared.module";
import { AppComponent } from "./components/app/app.component";
import { HomeComponent } from "./components/home/home.component";
import { NavMenuComponent } from "./components/nav-menu/nav-menu.component";
import "./rx-imports";
import { AuthorizationService } from "./services/authorization/authorization.service";
import { HttpAuthorizationInterceptor } from "./services/http.authorization.interceptor/http.authorization.interceptor";
import { HttpHandlerService } from "./services/http.handler/http.handler.service";
import { NoneCacheInterceptor } from "./services/none.cache.interceptor/none.cache.interceptor";
import { StorageService } from "./services/storage/storage.service";
import { TokenService } from "./services/token/token.service";
import { ToolsService } from "./services/tools/tools.service";

const MODULES = [
    AppSharedModule,
    RouterModule.forRoot(ROUTES, {
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        initialNavigation: "enabled"
    })
]

const PROVIDERS: Array<Provider> = [
    AuthorizationService,
    HttpHandlerService,
    StorageService,
    TokenService,
    ToolsService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthorizationInterceptor, deps: [Injector], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor, multi: true }
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
