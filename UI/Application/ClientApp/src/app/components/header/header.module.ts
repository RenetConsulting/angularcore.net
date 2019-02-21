import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LogoModule } from '../logo/logo.module';
import { HeaderComponent } from './header.component';

const MODULES = [
    CommonModule,
    LogoModule,
    MatButtonModule,
    RouterModule
];

const COMPONENTS = [
    HeaderComponent
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
export class HeaderModule { }
