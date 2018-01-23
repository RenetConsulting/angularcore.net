import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './components/components';
import { AppBaseModule } from './app.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        ServerModule,
        AppBaseModule,
        NoopAnimationsModule
    ],
    providers: [
        // Optional - Any other Server providers you want to pass (remember you'll have to provide them for the Browser as well)
        { provide: 'isNode', useValue: true },
    ]
})
export class AppModule { }
