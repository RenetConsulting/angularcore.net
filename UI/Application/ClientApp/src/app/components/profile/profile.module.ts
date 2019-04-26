import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { ProfileEffects } from './effects';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        NgxMatInputModule,
        EffectsModule.forFeature([ProfileEffects]),
    ],
})
export class ProfileModule { }
