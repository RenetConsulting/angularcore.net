import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GoogleSigninComponent } from './google-signin.component';

@NgModule({
    declarations: [GoogleSigninComponent],
    exports: [GoogleSigninComponent],
    imports: [
        CommonModule,
        MatButtonModule
    ],
})
export class GoogleSigninModule { }
