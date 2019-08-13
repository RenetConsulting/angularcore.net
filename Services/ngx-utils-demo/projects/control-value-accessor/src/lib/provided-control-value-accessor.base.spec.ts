import { NgControl } from '@angular/forms';
import { ControlValueAccessorBase } from './control-value-accessor.base';
import { ProvidedControlValueAccessorBase } from './provided-control-value-accessor.base';

class Test extends ProvidedControlValueAccessorBase { }

describe('ProvidedControlValueAccessorBase', () => {

    let base: ProvidedControlValueAccessorBase;

    let ngControl: NgControl;

    beforeEach(() => {
        ngControl = {} as NgControl;
        base = new Test(ngControl);
    });

    it('base instanceof ControlValueAccessorBase', () => {
        expect(base instanceof ControlValueAccessorBase).toEqual(true);
    });
    it('ngControl.valueAccessor', () => {
        expect(ngControl.valueAccessor).toEqual(base);
    });
});
