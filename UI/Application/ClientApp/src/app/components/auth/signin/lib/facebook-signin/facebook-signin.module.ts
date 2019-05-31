import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FacebookSigninComponent } from './facebook-signin.component';

@NgModule({
    declarations: [FacebookSigninComponent],
    exports: [FacebookSigninComponent],
    imports: [
        CommonModule,
        MatButtonModule
    ],
})
export class FacebookSigninModule { }
