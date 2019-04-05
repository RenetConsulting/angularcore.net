import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocialMediaComponent } from './social-media.component';

@NgModule({
    declarations: [SocialMediaComponent],
    exports: [SocialMediaComponent],
    imports: [
        CommonModule
    ],
})
export class SocialMediaModule { }
