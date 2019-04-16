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
        control = jasmine.createSpyObj<AbstractControl>('AbstractControl', ['markAsDirty', 'markAsTouched', 'updateValueAndValidity']);
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
        spyOn(component, 'setCaptchaAsync');
        spyOn(component, 'emitDecodedCaptcha');
        component.ngOnInit();
        component.formControl.patchValue({});
        expect(control.markAsDirty).toHaveBeenCalled();
        expect(control.markAsTouched).toHaveBeenCalled();
        expect(control.updateValueAndValidity).toHaveBeenCalled();
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
    it('emitDecodedCaptcha', () => {
        const captcha = 'bob';
        spyOn(component.resolved, 'emit');
        component.emitDecodedCaptcha(captcha);
        expect(component.resolved.emit).toHaveBeenCalledWith({ captcha, hash: component.captcha && component.captcha.hash });
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
    it('destroy', () => {
        spyOn(component.formControl, 'reset');
        component.destroy();
        expect(component.captcha).toBeNull();
        expect(component.formControl.reset).toHaveBeenCalled();
    });
    it('refresh', () => {
        spyOn(component, 'setCaptchaAsync');
        component.refresh();
        expect(component.setCaptchaAsync).toHaveBeenCalled();
    });
});
