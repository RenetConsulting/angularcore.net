import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { AbstractControl, FormControl, FormGroupDirective, NgControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
    @Input() errors: Array<string>;
    @Output() readonly resolved = new EventEmitter<IDecodedCaptcha>();
    @Output() readonly blur = new EventEmitter<null>();
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
    }

    ngOnDestroy(): void {
        this.destroy();
        this.subscription.unsubscribe();
    }

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

    emitDecodedCaptcha = () => this.resolved.emit(this.value);

    destroy = (): void => {
        this.captcha = null;
        this.captchaAsync = null;
        this.formControl.reset();
    }

    setCaptchaAsync = (): void => {
        if (this.url) {
            this.destroy();
            this.captchaAsync = this.http.get<IEncodedCaptcha>(`${this.url}${this.query}`).pipe(tap(i => this.captcha = i));
        }
    }

    refresh = () => this.setCaptchaAsync();

    /**  override {@link ngx-mat-input} validator */
    setValidator = (): void => {
        const validator = this.ngControl && this.ngControl.control && this.ngControl.control.validator;
        if (validator) {
            this.formControl.validator = this.mapValidator(validator);
        }
    }

    mapValidator = (validator: ValidatorFn): ValidatorFn => (): ValidationErrors | null =>
        validator({ value: this.value } as AbstractControl)

    onBlur = () => this.blur.emit(null);
}
