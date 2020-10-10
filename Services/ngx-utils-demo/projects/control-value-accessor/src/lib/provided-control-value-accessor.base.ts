import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ControlValueAccessorBase } from './control-value-accessor.base';

export abstract class ProvidedControlValueAccessorBase extends ControlValueAccessorBase implements ControlValueAccessor {

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
