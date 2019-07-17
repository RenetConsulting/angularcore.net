import { ValidatorDirective } from './validator.directive';
import { NgControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';

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
    it('validate', () => {
        expect(directive.validate instanceof EventEmitter).toEqual(true);
    });
    it('blur', () => {
        spyOn(directive, 'emitError');
        directive.blur();
        expect(directive.emitError).toHaveBeenCalled();
    });
});
