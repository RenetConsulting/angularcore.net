import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

@Component({
    selector: 'ngx-core-captcha-audio',
    templateUrl: './core-captcha-audio.component.html',
})
export class CoreCaptchaAudioComponent implements OnChanges, OnDestroy {

    @Input() sound: string;
    audio?: HTMLAudioElement;

    constructor() { }

    ngOnChanges() {
        this.pause();
        this.setAudio();
    }

    ngOnDestroy(): void {
        this.pause();
    }

    get paused() {
        return this.audio && this.audio.paused;
    }

    private play = () => this.audio && this.audio.play();

    private pause = () => this.audio && this.audio.pause();

    private setAudio = (): void => {
        if (typeof Audio !== 'undefined' && this.sound) {
            this.audio = new Audio(this.sound);
        }
    }

    toggle = () => this.paused ? this.play() : this.pause();
}
