import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { AbstractControl, FormControl, FormGroupDirective, NgControl, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IDecodedCaptcha } from './decoded-captcha';
import { IEncodedCaptcha } from './encoded-captcha';
import { ICoreCaptchaOptions } from './options';
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
    @Input() placeholder = 'Please type the text above';
    @Input() label = 'Core Captcha';
    @Output() readonly resolved = new EventEmitter<IDecodedCaptcha>();
    @HostBinding('class.d-block') readonly dBlock = true;
    readonly subscription = new Subscription();
    readonly formControl = new FormControl();
    captcha?: IEncodedCaptcha;
    captchaAsync: Observable<IEncodedCaptcha>;
    validator: ValidatorFn;

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
            if (options.placeholder) {
                this.placeholder = options.placeholder;
            }
        }
    }

    ngOnChanges(): void {
        this.setCaptchaAsync();
    }

    ngOnInit(): void {
        this.setCaptchaAsync();
        this.setValidator();
        if (this.formGroup) {
            this.subscription.add(this.formGroup.ngSubmit.subscribe(this.updateControl));
        }
        this.subscription.add(this.formControl.valueChanges.subscribe(this.emitDecodedCaptcha));
        this.subscription.add(this.resolved.subscribe(this.validate));
    }

    ngOnDestroy(): void {
        this.destroy();
        this.subscription.unsubscribe();
    }

    /** internal */
    get query() {
        return this.width && this.height ? `?width=${this.width}&height=${this.height}` : '';
    }

    get value() {
        return { captcha: this.formControl.value, hash: this.captcha && this.captcha.hash } as IDecodedCaptcha;
    }

    updateControl = (): void => {
        this.formControl.markAsDirty();
        this.formControl.markAsTouched();
        this.formControl.updateValueAndValidity();
    }

    /** internal */
    emitDecodedCaptcha = (): void => this.resolved.emit(this.value)

    /** internal */
    destroy = (): void => {
        this.captcha = null;
        this.captchaAsync = null;
        this.formControl.reset();
    }

    /** internal */
    setCaptchaAsync = (): void => {
        if (this.url) {
            this.destroy();
            this.captchaAsync = this.http.get<IEncodedCaptcha>(`${this.url}${this.query}`).pipe(tap(i => this.captcha = i));
        }
    }

    refresh = (): void => this.setCaptchaAsync();

    /** internal */
    setValidator = (): void => {
        this.validator = this.ngControl && this.ngControl.control && this.ngControl.control.validator;
    }

    /** internal */
    validate = (): void => {
        if (this.validator) {
            const errors = this.validator({ value: this.value } as AbstractControl);
            this.formControl.setErrors(errors);
        }
    }
}
