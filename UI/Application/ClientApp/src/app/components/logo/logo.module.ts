import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoComponent } from './logo.component';

const MODULES = [
    CommonModule
];

const COMPONENTS = [
    LogoComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class LogoModule { }
