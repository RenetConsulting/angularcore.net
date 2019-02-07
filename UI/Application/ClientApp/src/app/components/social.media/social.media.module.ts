import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocialMediaComponent } from './social.media.component';

const MODULES = [
    CommonModule
];

const COMPONENTS = [
    SocialMediaComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class SocialMediaModule { }