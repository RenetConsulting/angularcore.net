import { NgControl } from '@angular/forms';
import { ValidatorDirective } from './validator.directive';

describe('ValidatorDirective', () => {

    let directive: ValidatorDirective;

    let ngControl: NgControl;

    beforeEach(() => {

        ngControl = {} as NgControl;

        directive = new ValidatorDirective(ngControl);
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });
    it('onBlur', () => {
        spyOn(directive, 'emitError');
        directive.onBlur();
        expect(directive.emitError).toHaveBeenCalled();
    });
});
