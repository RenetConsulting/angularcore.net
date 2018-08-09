import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { ROUTES } from "./app.routes";
import { AppSharedModule } from "./app.shared.module";
import { AppComponent } from "./components/app/app.component";
import { HomeComponent } from "./components/home/home.component";
import { NavMenuComponent } from "./components/nav-menu/nav-menu.component";
import "./rx-imports";
import { LocalStorageService } from "./services/local.storage/local.storage.service";
import { TokenService } from "./services/token/token.service";

const MODULES = [
    AppSharedModule,
    RouterModule.forRoot(ROUTES, {
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        initialNavigation: "enabled"
    })
]

const PROVIDERS = [
    TokenService,
    LocalStorageService
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
