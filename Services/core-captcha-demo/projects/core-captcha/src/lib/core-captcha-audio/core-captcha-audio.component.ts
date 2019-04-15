import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

@Component({
    selector: 'ngx-core-captcha-audio',
    templateUrl: './core-captcha-audio.component.html',
})
export class CoreCaptchaAudioComponent implements OnChanges, OnDestroy {

    @Input() sound: string;
    audio?: HTMLAudioElement | null;

    constructor() { }

    ngOnChanges() {
        this.pause();
        this.setAudio();
    }

    ngOnDestroy(): void {
        this.pause();
    }

    /** internal */
    get paused() {
        return this.audio && this.audio.paused;
    }

    /** internal */
    play = () => this.audio && this.audio.play();

    /** internal */
    pause = () => this.audio && this.audio.pause();

    /** internal */
    setAudio = (): void => {
        if (typeof Audio !== 'undefined' && this.sound) {
            this.audio = new Audio(this.sound);
        }
    }

    toggle = () => this.paused ? this.play() : this.pause();
}
