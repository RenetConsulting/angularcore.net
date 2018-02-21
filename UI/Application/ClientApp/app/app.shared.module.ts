import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

declare var isDevelopment: any;
declare var VERSION: any;

export function isDevelopmentFactory() {
    return (typeof isDevelopment != 'undefined') ? isDevelopment : null;
}
export function VERSIONFactory() {
    return (typeof VERSION != 'undefined') ? VERSION : null;
}

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'appId' }),
        CommonModule,
        HttpModule
    ],
    exports: [
        CommonModule, FormsModule, ReactiveFormsModule, HttpModule
    ],
    providers: [
        { provide: 'isBrowser', useValue: null },
        { provide: 'isNode', useValue: null },
        { provide: 'isDevelopment', useFactory: (isDevelopmentFactory) },
        { provide: 'VERSION', useFactory: (VERSIONFactory) },
        { provide: 'WINDOW', useValue: null },
    ]
})
export class AppSharedModule {
}