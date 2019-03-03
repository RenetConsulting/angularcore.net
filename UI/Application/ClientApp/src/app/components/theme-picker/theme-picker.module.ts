import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { StoreModule } from '@ngrx/store';
import { themeReducer } from './reducer';
import { ThemePickerComponent } from './theme-picker.component';

const MODULES = [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    StoreModule.forFeature('theme', themeReducer)
];

const COMPONENTS = [
    ThemePickerComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
    imports: [...MODULES],
})
export class ThemePickerModule { }
