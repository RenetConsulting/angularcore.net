import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LogoModule } from '../logo/logo.module';
import { ThemePickerModule } from '../theme-picker/theme-picker.module';
import { HeaderComponent } from './header.component';

@NgModule({
    declarations: [HeaderComponent],
    exports: [HeaderComponent],
    imports: [
        CommonModule,
        LogoModule,
        MatButtonModule,
        RouterModule,
        ThemePickerModule
    ],
})
export class HeaderModule { }
