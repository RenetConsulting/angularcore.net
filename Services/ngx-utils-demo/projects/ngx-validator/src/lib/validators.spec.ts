import { AbstractControl, FormGroup } from '@angular/forms';
import { phoneUSRegExp } from './regexps';
import { mismatchPasswordValidator, phoneValidator } from './validators';

describe('validators', () => {

    describe('mismatchPasswordValidator', () => {

        it('should return null', () => {
            const value = 'KSSdJMASJn 1j^%1,';
            const password = { value } as AbstractControl;
            const parent = { controls: { password } as any } as FormGroup;
            const control = { value, parent } as AbstractControl;
            expect(mismatchPasswordValidator()(control)).toEqual(null);
        });
        it('should return errorMessage, when parent is null', () => {
            const value = 'KSSdJMASJn 1j^%1,';
            const control = { value } as AbstractControl;
            const errorMessage = 'bob';
            expect(mismatchPasswordValidator('password', errorMessage)(control)).toEqual({ errorMessage });
        });
        it('should return errorMessage', () => {
            const value = 'KSSdJMASJn 1j^%1,';
            const password = { value } as AbstractControl;
            const parent = { controls: { password } as any } as FormGroup;
            const control = { value: value + 1, parent } as AbstractControl;
            const errorMessage = 'bob';
            expect(mismatchPasswordValidator('password', errorMessage)(control)).toEqual({ errorMessage });
        });
    });

    describe('phoneValidator', () => {

        it('should return null by default', () => {
            const value = 'KSSdJMASJn 1j^%1,';
            const control = { value } as AbstractControl;
            expect(phoneValidator(/.*/gi)(control)).toEqual(null);
        });
        it('should return null when there is not any regexp', () => {
            const value = 'KSSdJMASJn 1j^%1,';
            const control = { value } as AbstractControl;
            expect(phoneValidator(null)(control)).toEqual(null);
        });
        it('should return errorMessage', () => {
            const value = 'KSSdJMASJn 1j^%1,';
            const control = { value } as AbstractControl;
            const errorMessage = 'bob';
            expect(phoneValidator(phoneUSRegExp, errorMessage)(control)).toEqual({ errorMessage });
        });

        describe('phone is right', () => {

            it('+1 (000) 123 5555', () => {
                const value = '+1 (000) 123 5555';
                const control = { value } as AbstractControl;
                const errorMessage = 'bob';
                expect(phoneValidator(phoneUSRegExp, errorMessage)(control)).toEqual({ errorMessage });
            });
            it('000 123 5555', () => {
                const value = '000 123 5555';
                const control = { value } as AbstractControl;
                const errorMessage = 'bob';
                expect(phoneValidator(phoneUSRegExp, errorMessage)(control)).toEqual({ errorMessage });
            });
            it('0001235555', () => {
                const value = '0001235555';
                const control = { value } as AbstractControl;
                const errorMessage = 'bob';
                expect(phoneValidator(phoneUSRegExp, errorMessage)(control)).toEqual({ errorMessage });
            });
        });
    });
});
