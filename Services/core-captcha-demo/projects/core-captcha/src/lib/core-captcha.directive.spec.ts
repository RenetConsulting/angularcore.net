import { CoreCaptchaComponent } from './core-captcha.component';
import { CoreCaptchaDirective } from './core-captcha.directive';
import { IDecodedCaptcha } from './decoded-captcha';

describe('CoreCaptchaDirective', () => {

    let directive: CoreCaptchaDirective;

    const captcha = 'bob';
    const model = { captcha } as IDecodedCaptcha;

    beforeEach(() => {
        directive = new CoreCaptchaDirective();
    });

    it('resolve', () => {
        directive.onChange = jasmine.createSpy();
        directive.onTouched = jasmine.createSpy();
        directive.resolve(model);
        expect(directive.onChange).toHaveBeenCalledWith(model);
        expect(directive.onTouched).toHaveBeenCalled();
    });
    describe('writeValue', () => {
        it('empty string', () => {
            directive.host = jasmine.createSpyObj<CoreCaptchaComponent>('CoreCaptchaComponent', ['destroy']);
            directive.writeValue('');
            expect(directive.host.destroy).toHaveBeenCalled();
        });
        it('empty string', () => {
            directive.host = jasmine.createSpyObj<CoreCaptchaComponent>('CoreCaptchaComponent', ['destroy']);
            directive.writeValue(null);
            expect(directive.host.destroy).toHaveBeenCalled();
        });
    });
    it('registerOnChange', () => {
        const fn = jasmine.createSpy();
        directive.registerOnChange(fn);
        expect(directive.onChange).toEqual(fn);
    });
    it('registerOnTouched', () => {
        const fn = jasmine.createSpy();
        directive.registerOnTouched(fn);
        expect(directive.onTouched).toEqual(fn);
    });
});
