import { CoreCaptchaComponent } from './core-captcha.component';
import { CoreCaptchaDirective } from './core-captcha.directive';
import { IDecodedCaptcha } from './decoded-captcha';

describe('CoreCaptchaDirective', () => {

    let directive: CoreCaptchaDirective;

    const captcha = 'bob';
    const model = { captcha } as IDecodedCaptcha;

    beforeEach(() => {
        directive = new CoreCaptchaDirective();
        directive.host = jasmine.createSpyObj<CoreCaptchaComponent>('CoreCaptchaComponent', ['refresh']);
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
            directive.writeValue('');
            expect(directive.host.refresh).toHaveBeenCalled();
        });
        it('empty string', () => {
            directive.writeValue(null);
            expect(directive.host.refresh).toHaveBeenCalled();
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
