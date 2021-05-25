import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ControlValueAccessorBaseDirective } from './control-value-accessor.base';
import { Directive } from '@angular/core';

@Directive()
export abstract class ProvidedControlValueAccessorBaseDirective extends ControlValueAccessorBaseDirective implements ControlValueAccessor {

    constructor(
        public ngControl: NgControl
    ) {
        super();
        if (this.ngControl) {
            // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }
    }
}
