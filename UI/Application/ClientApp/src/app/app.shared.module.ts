import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    ],
    exports: [
        CommonModule,
        HttpClientModule
    ]
})
export class AppSharedModule { }
