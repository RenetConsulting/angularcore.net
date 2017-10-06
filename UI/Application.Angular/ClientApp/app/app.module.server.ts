import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './components/components';
import { AppModule } from './app.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        ServerModule,
        AppModule,
        NoopAnimationsModule
    ]
})
export class AppModuleServer { }
