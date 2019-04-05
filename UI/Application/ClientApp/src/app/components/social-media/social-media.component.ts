import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'social-media',
    templateUrl: './social-media.component.html',
    styleUrls: ['./social-media.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialMediaComponent {

    constructor() { }
}