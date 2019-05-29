import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SigninExternalComponent } from './signin-external.component';

@NgModule({
    declarations: [SigninExternalComponent],
    exports: [SigninExternalComponent],
    imports: [
        CommonModule,
        MatButtonModule
    ],
})
export class SigninExternalModule { }
