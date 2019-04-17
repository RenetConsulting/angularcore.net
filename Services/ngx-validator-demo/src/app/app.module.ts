import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxValidatorModule } from 'projects/ngx-validator/src/public-api';
import { AppComponent } from './app.component';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        NgxValidatorModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
