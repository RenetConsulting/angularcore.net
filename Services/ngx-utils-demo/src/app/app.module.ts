import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import 'hammerjs';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(ROUTES)
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } as MatFormFieldDefaultOptions }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
