import { ControlValueAccessorBase } from './control-value-accessor.base';
import { Directive } from "@angular/core";

@Directive()
class Test extends ControlValueAccessorBase { }

describe('ControlValueAccessorBase', () => {

    let base: ControlValueAccessorBase;


    beforeEach(() => {
        base = new Test();
    });

    it('writeValue', () => {
        const value = '123';
        base.onChange = jasmine.createSpy();
        base.writeValue(value);
        expect(base.value).toEqual(value);
        expect(base.onChange).toHaveBeenCalledWith(value);
    });
    it('registerOnChange', () => {
        const fn = () => { };
        base.registerOnChange(fn);
        expect(base.onChange).toEqual(fn);
    });
    it('registerOnTouched', () => {
        const fn = () => { };
        base.registerOnTouched(fn);
        expect(base.onTouched).toEqual(fn);
    });
    it('setDisabledState', () => {
        const value = true;
        base.setDisabledState(value);
        expect(base.disabled).toEqual(value);
    });
});
