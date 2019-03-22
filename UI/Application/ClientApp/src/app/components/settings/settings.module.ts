import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { ControlInputModule } from '../control-input/control-input.module';
import { SettingsEffects } from './effects';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        ControlInputModule,
        EffectsModule.forFeature([SettingsEffects])
    ],
})
export class SettingsModule { }
