import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { ProfileEffects } from './effects';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { profileReducer } from './reducer';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        NgxMatInputModule,
        StoreModule.forFeature('profile', profileReducer),
        EffectsModule.forFeature([ProfileEffects]),
    ],
})
export class ProfileModule { }
