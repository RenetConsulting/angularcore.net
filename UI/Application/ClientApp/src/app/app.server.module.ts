import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { AppSharedModule } from './app.shared.module';
import { AppComponent } from './components/app/app.component';

@NgModule({
    imports: [NoopAnimationsModule, AppSharedModule, ServerModule],
    bootstrap: [AppComponent]
})
export class AppServerModule { }