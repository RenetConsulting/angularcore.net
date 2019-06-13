import { ControlValueAccessor, NgControl } from '@angular/forms';

export abstract class ControlValueAccessorBase implements ControlValueAccessor {

    disabled: boolean;
    onChange: (i) => any | null;
    onTouched: () => void;
    value;

    constructor(
        public ngControl: NgControl
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    /** internal */
    writeValue(value): void {
        this.value = value;
        if (this.onChange) {
            this.onChange(value);
        }
    }

    /** internal */
    registerOnChange(fn): void {
        this.onChange = fn;
    }

    /** internal */
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }

    /** internal */
    setDisabledState(value: boolean): void {
        this.disabled = value;
    }
}
