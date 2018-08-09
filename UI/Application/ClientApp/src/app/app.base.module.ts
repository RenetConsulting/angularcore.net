import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { ROUTES } from "./app.routes";
import { AppSharedModule } from "./app.shared.module";
import { AppComponent } from "./components/app/app.component";
import { HomeComponent } from "./components/home/home.component";
import { NavMenuComponent } from "./components/nav-menu/nav-menu.component";
import "./rx-imports";

const COMPONENTS = [
    AppComponent,
    NavMenuComponent,
    HomeComponent
]

const MODULES = [
    AppSharedModule,
    RouterModule.forRoot(ROUTES, {
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        initialNavigation: "enabled"
    })
]

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        ...MODULES
    ],
    providers: []
})
export class AppBaseModule { }
