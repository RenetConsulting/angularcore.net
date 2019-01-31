import { NgModule } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ServerModule } from "@angular/platform-server";
import { ModuleMapLoaderModule } from "@nguniversal/module-map-ngfactory-loader";
import { AppBaseModule } from "./app.base.module";
import { AppComponent } from "./components/app/app.component";

@NgModule({
    imports: [NoopAnimationsModule, AppBaseModule, ServerModule, ModuleMapLoaderModule],
    bootstrap: [AppComponent]
})
export class AppServerModule { }
