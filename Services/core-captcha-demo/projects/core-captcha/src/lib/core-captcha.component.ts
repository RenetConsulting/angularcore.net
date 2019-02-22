import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { FormControl, FormGroupDirective, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IDecodedCaptcha } from './decoded.captcha';
import { IEncodedCaptcha } from './encoded.captcha';

@Component({
    selector: 'ngx-core-captcha',
    templateUrl: './core-captcha.component.html',
    styleUrls: ['./core-captcha.component.scss']
})
export class CoreCaptchaComponent implements OnInit, OnDestroy {

    @Input() url: string;
    @Output() readonly resolved = new EventEmitter<IDecodedCaptcha>();
    readonly subscription = new Subscription();
    readonly formControl = new FormControl();
    audio?: HTMLAudioElement;
    captcha?: IEncodedCaptcha;

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Optional() @Self() @Inject(NgControl) private ngControl?: NgControl,
        @Optional() @Inject(FormGroupDirective) private parentFormGroup?: FormGroupDirective,
    ) { }

    ngOnInit(): void {
        this.getCaptcha();
        this.subscription.add(this.parentFormGroup && this.parentFormGroup.ngSubmit.subscribe(() => {
            this.ngControl.control.markAsDirty();
            this.ngControl.control.markAsTouched();
            this.ngControl.control.updateValueAndValidity();
        }));
        this.subscription.add(this.control.valueChanges.subscribe(this.emitDecodedCaptcha));
    }

    ngOnDestroy(): void {
        this.reset();
        this.subscription.unsubscribe();
    }

    get paused() {
        return this.audio && this.audio.paused;
    }

    get control() {
        return this.ngControl && this.ngControl.control || this.formControl;
    }

    private setCaptcha = (model: IEncodedCaptcha): void => {
        if (model) {
            this.captcha = model;
            this.setAudio(model.sound);
        }
    }

    private play = () => this.audio && this.audio.play();

    private pause = () => this.audio && this.audio.pause();

    private setAudio = (src: string): void => {
        if (typeof Audio !== 'undefined') {
            this.audio = new Audio(src);
        }
    }

    private emitDecodedCaptcha = (captcha: string): void => this.resolved.emit({ captcha, hash: this.captcha && this.captcha.hash });

    toggleAudio = () => this.paused ? this.play() : this.pause();

    getCaptcha = (): void => {
        if (this.http && this.url) {
            this.reset();
            this.http.get<IEncodedCaptcha>(this.url)
                .subscribe(this.setCaptcha);
        }
    }

    reset = (): void => {
        this.pause();
        this.captcha = null;
    }
}
