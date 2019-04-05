import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { StoreModule } from '@ngrx/store';
import { themeReducer } from './reducer';
import { ThemePickerComponent } from './theme-picker.component';

@NgModule({
    declarations: [ThemePickerComponent],
    exports: [ThemePickerComponent],
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule,
        StoreModule.forFeature('theme', themeReducer)
    ],
})
export class ThemePickerModule { }
