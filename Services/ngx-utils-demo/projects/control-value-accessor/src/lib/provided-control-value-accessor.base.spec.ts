import { NgControl } from '@angular/forms';
import { ControlValueAccessorBaseDirective } from './control-value-accessor.base';
import { ProvidedControlValueAccessorBaseDirective } from './provided-control-value-accessor.base';
import { Directive } from '@angular/core';

@Directive()
class TestDirective extends ProvidedControlValueAccessorBaseDirective { }

describe('ProvidedControlValueAccessorBaseDirective', () => {

    let base: ProvidedControlValueAccessorBaseDirective;

    let ngControl: NgControl;

    beforeEach(() => {
        ngControl = {} as NgControl;
        base = new TestDirective(ngControl);
    });

    it('base instanceof ControlValueAccessorBaseDirective', () => {
        expect(base instanceof ControlValueAccessorBaseDirective).toEqual(true);
    });
    it('ngControl.valueAccessor', () => {
        expect(ngControl.valueAccessor).toEqual(base);
    });
});
