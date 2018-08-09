import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { ROUTES } from "./app.routes";
import { AppSharedModule } from "./app.shared.module";
import { AppComponent } from "./app/app.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { HomeComponent } from "./home/home.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        FetchDataComponent
    ],
    imports: [
        AppSharedModule,
        RouterModule.forRoot(ROUTES, {
            useHash: false,
            preloadingStrategy: PreloadAllModules,
            initialNavigation: "enabled"
        })
    ],
    providers: []
})
export class AppBaseModule { }
