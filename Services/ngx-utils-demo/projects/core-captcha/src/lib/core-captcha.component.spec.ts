import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CoreCaptchaComponent } from './core-captcha.component';
import { IEncodedCaptcha } from './encoded-captcha';
import { ICoreCaptchaOptions } from './options';

describe('CoreCaptchaComponent', () => {

    let component: CoreCaptchaComponent;
    const options: ICoreCaptchaOptions = {
        height: 25,
        url: 'https://',
        width: 48,
        placeholder: 'bob'
    };
    let http: jasmine.SpyObj<HttpClient>;
    let ngControl: { control: jasmine.SpyObj<AbstractControl> };
    let formGroup: { ngSubmit: Observable<any> };
    let control: jasmine.SpyObj<AbstractControl>;

    beforeEach(() => {
        http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
        control = jasmine.createSpyObj<AbstractControl>('AbstractControl', [
            'markAsDirty',
            'markAsTouched',
            'updateValueAndValidity',
            'validator'
        ]);
        ngControl = { control };
        formGroup = { ngSubmit: of(null) };

        component = new CoreCaptchaComponent(
            options,
            http,
            ngControl as any,
            formGroup as FormGroupDirective
        );
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('height', () => {
        expect(component.height).toEqual(options.height);
    });
    it('url', () => {
        expect(component.url).toEqual(options.url);
    });
    it('width', () => {
        expect(component.width).toEqual(options.width);
    });
    it('placeholder', () => {
        expect(component.placeholder).toEqual(options.placeholder);
    });
    it('ngOnChanges', () => {
        spyOn(component, 'setCaptchaAsync');
        component.ngOnChanges();
        expect(component.setCaptchaAsync).toHaveBeenCalled();
    });
    it('ngOnInit', () => {
        spyOn(component, 'updateControl');
        spyOn(component, 'setCaptchaAsync');
        spyOn(component, 'emitDecodedCaptcha');
        component.ngOnInit();
        component.formControl.patchValue({});
        expect(component.updateControl).toHaveBeenCalled();
        expect(component.setCaptchaAsync).toHaveBeenCalled();
        expect(component.emitDecodedCaptcha).toHaveBeenCalled();
        component.subscription.unsubscribe();
    });
    it('ngOnDestroy', () => {
        spyOn(component, 'destroy');
        component.ngOnDestroy();
        expect(component.destroy).toHaveBeenCalled();
        expect(component.subscription.closed).toEqual(true);
    });
    it('query', () => {
        expect(component.query).toEqual('?width=48&height=25');
    });
    it('value', () => {
        expect(component.value).toEqual({ captcha: null, hash: undefined });
    });
    it('updateControl', () => {
        spyOn(component.formControl, 'markAsDirty');
        spyOn(component.formControl, 'markAsTouched');
        spyOn(component.formControl, 'updateValueAndValidity');
        component.updateControl();
        expect(component.formControl.markAsDirty).toHaveBeenCalled();
        expect(component.formControl.markAsTouched).toHaveBeenCalled();
        expect(component.formControl.updateValueAndValidity).toHaveBeenCalled();
    });
    it('emitDecodedCaptcha', () => {
        const captcha = 'bob';
        Object.defineProperty(component, 'value', { get: () => ({ captcha, hash: component.captcha && component.captcha.hash }) });
        spyOn(component.resolved, 'emit');
        component.emitDecodedCaptcha();
        expect(component.resolved.emit).toHaveBeenCalledWith({ captcha, hash: component.captcha && component.captcha.hash });
    });
    it('destroy', () => {
        spyOn(component.formControl, 'reset');
        component.destroy();
        expect(component.captcha).toBeNull();
        expect(component.formControl.reset).toHaveBeenCalled();
    });
    it('setCaptchaAsync', () => {
        const captcha = {} as IEncodedCaptcha;
        component.url = 'https://';
        spyOn(component, 'destroy');
        const query = `?width=${component.width}&height=${component.height}`;
        http.get.and.returnValue(of(captcha));
        component.setCaptchaAsync();
        component.captchaAsync.subscribe();
        expect(http.get).toHaveBeenCalledWith(`${component.url}${query}`);
        expect(component.captcha).toEqual(captcha);
    });
    it('refresh', () => {
        spyOn(component, 'setCaptchaAsync');
        component.refresh();
        expect(component.setCaptchaAsync).toHaveBeenCalled();
    });
    it('setValidator', () => {
        spyOn(component, 'mapValidator');
        component.setValidator();
        expect(component.mapValidator).toHaveBeenCalled();
    });
    it('mapValidator', () => {
        const validator = jasmine.createSpy();
        component.mapValidator(validator)(null);
        expect(validator).toHaveBeenCalledWith({ value: component.value });
    });
    it('onBlur', () => {
        spyOn(component.blur, 'emit');
        component.onBlur();
        expect(component.blur.emit).toHaveBeenCalledWith(null);
    });
});
