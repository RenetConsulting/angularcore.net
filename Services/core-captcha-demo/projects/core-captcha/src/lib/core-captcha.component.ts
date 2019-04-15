import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { FormControl, FormGroupDirective, NgControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICoreCaptchaOptions } from './core-captcha-options';
import { IDecodedCaptcha } from './decoded-captcha';
import { IEncodedCaptcha } from './encoded-captcha';
import { NGX_CORE_CAPTCHA_OPTIONS } from './tokens';

@Component({
    selector: 'ngx-core-captcha',
    templateUrl: './core-captcha.component.html',
    styleUrls: ['./core-captcha.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreCaptchaComponent implements OnInit, OnDestroy, OnChanges {

    @Input() height?: number;
    @Input() url?: string;
    @Input() width?: number;
    @Output() readonly resolved = new EventEmitter<IDecodedCaptcha>();
    @HostBinding('class.d-block') readonly dBlock = true;
    readonly subscription = new Subscription();
    readonly formControl = new FormControl();
    captcha?: IEncodedCaptcha;
    captchaAsync: Observable<IEncodedCaptcha>;

    constructor(
        @Inject(NGX_CORE_CAPTCHA_OPTIONS) options: ICoreCaptchaOptions,
        @Inject(HttpClient) private http: HttpClient,
        @Optional() @Self() @Inject(NgControl) private ngControl?: NgControl,
        @Optional() @Inject(FormGroupDirective) private formGroup?: FormGroupDirective,
    ) {
        if (options) {
            this.height = options.height;
            this.url = options.url;
            this.width = options.width;
        }
    }

    ngOnChanges(): void {
        this.setCaptchaAsync();
    }

    ngOnInit(): void {
        this.setCaptchaAsync();
        if (this.formGroup) {
            this.subscription.add(this.formGroup.ngSubmit.subscribe(() => {
                this.ngControl.control.markAsDirty();
                this.ngControl.control.markAsTouched();
                this.ngControl.control.updateValueAndValidity();
            }));
        }
        this.subscription.add(this.formControl.valueChanges.subscribe(this.emitDecodedCaptcha));
    }

    ngOnDestroy(): void {
        this.destroy();
        this.subscription.unsubscribe();
    }

    /** internal */
    emitDecodedCaptcha = (captcha: string): void => this.resolved.emit({ captcha, hash: this.captcha && this.captcha.hash });

    /** internal */
    setCaptchaAsync = (): void => {
        if (this.url) {
            this.destroy();
            const query = this.width && this.height ? `?width=${this.width}&height=${this.height}` : '';
            this.captchaAsync = this.http.get<IEncodedCaptcha>(`${this.url}${query}`).pipe(
                tap(i => this.captcha = i)
            );
        }
    }

    /** internal */
    destroy = (): void => {
        this.captcha = null;
        this.captchaAsync = null;
        this.formControl.reset();
    }

    refresh = (): void => this.setCaptchaAsync();
}
