import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeadphones, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { CoreCaptchaAudioComponent } from './core-captcha-audio/core-captcha-audio.component';
import { CoreCaptchaComponent } from './core-captcha.component';
import { CoreCaptchaDirective } from './core-captcha.directive';

@NgModule({
    declarations: [CoreCaptchaComponent, CoreCaptchaDirective, CoreCaptchaAudioComponent],
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, FontAwesomeModule, MatCardModule, MatProgressSpinnerModule],
    exports: [CoreCaptchaComponent, CoreCaptchaDirective]
})
export class CoreCaptchaModule {
    constructor() {
        library.add(faRedoAlt, faHeadphones);
    }
}
